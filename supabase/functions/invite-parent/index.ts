import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the caller is a school admin
    const authHeader = req.headers.get("Authorization")!;
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check school_admin role
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role, school_id")
      .eq("user_id", caller.id)
      .eq("role", "school_admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Only school admins can invite parents" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, full_name, phone, student_ids, relationship } = await req.json();

    if (!email || !student_ids || student_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "Email and at least one student_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify students belong to the same school
    const { data: students } = await adminClient
      .from("students")
      .select("id")
      .in("id", student_ids)
      .eq("school_id", roleData.school_id);

    if (!students || students.length !== student_ids.length) {
      return new Response(
        JSON.stringify({ error: "One or more students don't belong to your school" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the parent user via admin API (invite by email)
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { full_name: full_name || "", role: "parent" },
    });

    if (inviteError) {
      // If user already exists, just get them
      if (inviteError.message.includes("already been registered")) {
        const { data: { users } } = await adminClient.auth.admin.listUsers();
        const existingUser = users?.find((u: any) => u.email === email);
        
        if (!existingUser) {
          return new Response(
            JSON.stringify({ error: "User exists but could not be found" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Assign parent role if not already assigned
        const { data: existingRole } = await adminClient
          .from("user_roles")
          .select("id")
          .eq("user_id", existingUser.id)
          .eq("role", "parent")
          .single();

        if (!existingRole) {
          await adminClient.from("user_roles").insert({
            user_id: existingUser.id,
            role: "parent",
            school_id: roleData.school_id,
          });
        }

        // Update profile
        await adminClient
          .from("profiles")
          .update({
            school_id: roleData.school_id,
            full_name: full_name || undefined,
            phone: phone || undefined,
          })
          .eq("id", existingUser.id);

        // Link to students
        for (const studentId of student_ids) {
          await adminClient.from("parent_students").upsert(
            {
              parent_id: existingUser.id,
              student_id: studentId,
              relationship: relationship || "parent",
            },
            { onConflict: "parent_id,student_id" }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: "Existing parent linked to students", user_id: existingUser.id }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw inviteError;
    }

    const parentUserId = inviteData.user.id;

    // Assign parent role
    await adminClient.from("user_roles").insert({
      user_id: parentUserId,
      role: "parent",
      school_id: roleData.school_id,
    });

    // Update profile with school
    await adminClient
      .from("profiles")
      .update({
        school_id: roleData.school_id,
        full_name: full_name || undefined,
        phone: phone || undefined,
      })
      .eq("id", parentUserId);

    // Link parent to students
    for (const studentId of student_ids) {
      await adminClient.from("parent_students").insert({
        parent_id: parentUserId,
        student_id: studentId,
        relationship: relationship || "parent",
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Parent invited and linked to students", user_id: parentUserId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
