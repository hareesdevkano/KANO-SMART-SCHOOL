import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get the authorization header to verify the caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the caller is a school admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: callerUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !callerUser) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if caller has school_admin role
    const { data: callerRoles } = await supabaseAdmin
      .from("user_roles")
      .select("role, school_id")
      .eq("user_id", callerUser.id)
      .eq("role", "school_admin")
      .single();

    if (!callerRoles) {
      return new Response(
        JSON.stringify({ error: "Only school admins can register teachers" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const schoolId = callerRoles.school_id;

    const body = await req.json();
    const { email, password, full_name, phone, employee_id, qualification, specialization, class_ids } = body;

    if (!email || !password || !full_name) {
      return new Response(
        JSON.stringify({ error: "Email, password, and full name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to create auth user, or find existing one
    let userId: string;
    
    const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, phone },
    });

    if (createUserError) {
      // If user already exists, look them up and use their ID
      if (createUserError.message.includes("already been registered")) {
        const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) {
          return new Response(
            JSON.stringify({ error: "Failed to look up existing user" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const existingUser = existingUsers.users.find((u) => u.email === email);
        if (!existingUser) {
          return new Response(
            JSON.stringify({ error: "User exists but could not be found" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // Check if already a teacher at this school
        const { data: existingTeacher } = await supabaseAdmin
          .from("teachers")
          .select("id")
          .eq("user_id", existingUser.id)
          .eq("school_id", schoolId)
          .maybeSingle();
        
        if (existingTeacher) {
          return new Response(
            JSON.stringify({ error: "This user is already registered as a teacher in your school" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        userId = existingUser.id;
      } else {
        return new Response(
          JSON.stringify({ error: createUserError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      userId = authData.user.id;
    }

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        email,
        full_name,
        phone,
        school_id: schoolId,
      });

    if (profileError) {
      console.error("Profile error:", profileError);
    }

    // Assign teacher role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "teacher",
        school_id: schoolId,
      });

    if (roleError) {
      console.error("Role error:", roleError);
    }

    // Create teacher record
    const { data: teacherData, error: teacherError } = await supabaseAdmin
      .from("teachers")
      .insert({
        user_id: userId,
        school_id: schoolId,
        employee_id,
        qualification,
        specialization,
      })
      .select()
      .single();

    if (teacherError) {
      return new Response(
        JSON.stringify({ error: teacherError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Assign classes to teacher if provided
    if (class_ids && Array.isArray(class_ids) && class_ids.length > 0) {
      const teacherClassRecords = class_ids.map((classId: string, index: number) => ({
        teacher_id: teacherData.id,
        class_id: classId,
        is_class_teacher: index === 0, // First class is marked as primary
      }));

      const { error: classAssignError } = await supabaseAdmin
        .from("teacher_classes")
        .insert(teacherClassRecords);

      if (classAssignError) {
        console.error("Class assignment error:", classAssignError);
      } else {
        console.log(`Assigned ${class_ids.length} classes to teacher ${teacherData.id}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        teacher: teacherData,
        message: "Teacher registered successfully" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});