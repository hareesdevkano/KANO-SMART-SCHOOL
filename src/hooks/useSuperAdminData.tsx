import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type School = Database["public"]["Tables"]["schools"]["Row"];
type SchoolStatus = Database["public"]["Enums"]["school_status"];
type SubscriptionPlan = Database["public"]["Enums"]["subscription_plan"];

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["super-admin-stats"],
    queryFn: async () => {
      // Fetch schools count and distribution
      const { data: schools, error: schoolsError } = await supabase
        .from("schools")
        .select("id, status, subscription_plan, created_at");

      if (schoolsError) throw schoolsError;

      // Fetch total students
      const { count: studentsCount } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

      // Fetch total teachers
      const { count: teachersCount } = await supabase
        .from("teachers")
        .select("*", { count: "exact", head: true });

      const totalSchools = schools?.length || 0;
      const pendingSchools = schools?.filter(s => s.status === "pending").length || 0;
      const approvedSchools = schools?.filter(s => s.status === "approved").length || 0;
      const suspendedSchools = schools?.filter(s => s.status === "suspended").length || 0;

      const premiumSchools = schools?.filter(s => s.subscription_plan === "premium").length || 0;
      const basicSchools = schools?.filter(s => s.subscription_plan === "basic").length || 0;
      const freeSchools = schools?.filter(s => s.subscription_plan === "free").length || 0;
      const enterpriseSchools = schools?.filter(s => s.subscription_plan === "enterprise").length || 0;

      // Calculate monthly registrations
      const now = new Date();
      const thisMonth = schools?.filter(s => {
        const createdAt = new Date(s.created_at || "");
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
      }).length || 0;

      return {
        totalSchools,
        pendingSchools,
        approvedSchools,
        suspendedSchools,
        totalStudents: studentsCount || 0,
        totalTeachers: teachersCount || 0,
        thisMonthRegistrations: thisMonth,
        subscriptionDistribution: {
          premium: premiumSchools,
          basic: basicSchools,
          free: freeSchools,
          enterprise: enterpriseSchools,
        },
      };
    },
  });
};

export const useSchools = () => {
  return useQuery({
    queryKey: ["all-schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as School[];
    },
  });
};

export const useRecentSchools = (limit = 5) => {
  return useQuery({
    queryKey: ["recent-schools", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as School[];
    },
  });
};

export const useUpdateSchoolStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ schoolId, status }: { schoolId: string; status: SchoolStatus }) => {
      const { error } = await supabase
        .from("schools")
        .update({ status })
        .eq("id", schoolId);

      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["all-schools"] });
      queryClient.invalidateQueries({ queryKey: ["recent-schools"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-stats"] });
      toast({
        title: "School Updated",
        description: `School status changed to ${status}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSchoolSubscription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ schoolId, plan }: { schoolId: string; plan: SubscriptionPlan }) => {
      const { error } = await supabase
        .from("schools")
        .update({ subscription_plan: plan })
        .eq("id", schoolId);

      if (error) throw error;
    },
    onSuccess: (_, { plan }) => {
      queryClient.invalidateQueries({ queryKey: ["all-schools"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-stats"] });
      toast({
        title: "Subscription Updated",
        description: `School plan changed to ${plan}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSchool = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (schoolId: string) => {
      const { error } = await supabase
        .from("schools")
        .delete()
        .eq("id", schoolId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-schools"] });
      queryClient.invalidateQueries({ queryKey: ["recent-schools"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-stats"] });
      toast({
        title: "School Deleted",
        description: "School has been removed from the platform",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAllProfiles = () => {
  return useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, school_id");

      if (rolesError) throw rolesError;

      // Merge roles into profiles
      const profilesWithRoles = profiles?.map(profile => ({
        ...profile,
        user_role: roles?.find(r => r.user_id === profile.id) || null,
      }));

      return profilesWithRoles;
    },
  });
};
