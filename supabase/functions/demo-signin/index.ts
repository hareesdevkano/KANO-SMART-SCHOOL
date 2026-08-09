import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEMO_PASSWORD = "Demo@2025";
const DEMO_SCHOOL_NAME = "SmartSchool Demo Academy";

const DEMO_USERS: Record<string, { email: string; role: string; full_name: string }> = {
  super_admin:  { email: "demo.super@smartschool.ng",   role: "super_admin",  full_name: "Demo Super Admin" },
  school_admin: { email: "demo.admin@smartschool.ng",   role: "school_admin", full_name: "Demo School Admin" },
  teacher:      { email: "demo.teacher@smartschool.ng", role: "teacher",      full_name: "Demo Teacher" },
  student:      { email: "demo.student@smartschool.ng", role: "student",      full_name: "Demo Student" },
  parent:       { email: "demo.parent@smartschool.ng",  role: "parent",       full_name: "Demo Parent" },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { role } = await req.json();
    const target = DEMO_USERS[role];
    if (!target) {
      return new Response(JSON.stringify({ error: "Invalid role" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Ensure demo school
    let schoolId: string | null = null;
    if (target.role !== "super_admin") {
      const { data: existing } = await admin
        .from("schools").select("id").eq("name", DEMO_SCHOOL_NAME).maybeSingle();
      if (existing) schoolId = existing.id;
      else {
        const { data: created } = await admin.from("schools").insert({
          name: DEMO_SCHOOL_NAME,
          school_type: "secondary",
          email: "demo@smartschool.ng",
          phone: "+2340000000000",
          address: "Demo Street",
          city: "Kano",
          state: "Kano",
          status: "approved",
          subscription_plan: "premium",
        }).select("id").single();
        schoolId = created?.id ?? null;
      }
    }

    // Find or create auth user
    let userId: string | null = null;
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = list?.users?.find((u) => u.email === target.email);
    if (found) {
      userId = found.id;
      // Reset password to known value in case it drifted
      await admin.auth.admin.updateUserById(userId, { password: DEMO_PASSWORD, email_confirm: true });
    } else {
      const { data: created, error } = await admin.auth.admin.createUser({
        email: target.email,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: target.full_name },
      });
      if (error) throw error;
      userId = created.user!.id;
    }

    // Ensure profile has school_id
    await admin.from("profiles").update({
      school_id: schoolId,
      full_name: target.full_name,
    }).eq("id", userId);

    // Ensure role
    const { data: roles } = await admin.from("user_roles")
      .select("id").eq("user_id", userId).eq("role", target.role);
    if (!roles || roles.length === 0) {
      await admin.from("user_roles").insert({
        user_id: userId, role: target.role, school_id: schoolId,
      });
    } else if (schoolId) {
      await admin.from("user_roles").update({ school_id: schoolId })
        .eq("user_id", userId).eq("role", target.role);
    }

    return new Response(JSON.stringify({
      email: target.email, password: DEMO_PASSWORD, role: target.role,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
