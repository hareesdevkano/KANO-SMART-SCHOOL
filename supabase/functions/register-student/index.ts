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
        JSON.stringify({ error: "Only school admins can register students" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const schoolId = callerRoles.school_id;

    const body = await req.json();
    const { 
      full_name,
      registration_number, 
      class_id, 
      guardian_name, 
      guardian_phone, 
      guardian_email, 
      gender, 
      date_of_birth, 
      address 
    } = body;

    if (!registration_number || !full_name) {
      return new Response(
        JSON.stringify({ error: "Registration number and full name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create student record (without auth user for now - students may not need login)
    const { data: studentData, error: studentError } = await supabaseAdmin
      .from("students")
      .insert({
        school_id: schoolId,
        registration_number,
        class_id: class_id || null,
        guardian_name,
        guardian_phone,
        guardian_email,
        gender,
        date_of_birth: date_of_birth || null,
        address,
      })
      .select()
      .single();

    if (studentError) {
      return new Response(
        JSON.stringify({ error: studentError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        student: studentData,
        message: "Student registered successfully" 
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
