export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academic_levels: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_index: number | null
          school_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_index?: number | null
          school_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_index?: number | null
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_levels_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_sessions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          name: string
          school_id: string
          start_date: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          name: string
          school_id: string
          start_date?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          name?: string
          school_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_sessions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_terms: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          name: string
          school_id: string
          session_id: string
          start_date: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          name: string
          school_id: string
          session_id: string
          start_date?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          name?: string
          school_id?: string
          session_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_terms_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_terms_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_published: boolean | null
          school_id: string
          target_roles: string[] | null
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          school_id: string
          target_roles?: string[] | null
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          school_id?: string
          target_roles?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          assessment_type: string | null
          class_id: string
          created_at: string | null
          created_by: string | null
          id: string
          is_oral: boolean | null
          max_score: number | null
          school_id: string
          subject_id: string
          term_id: string | null
          title: string
        }
        Insert: {
          assessment_type?: string | null
          class_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_oral?: boolean | null
          max_score?: number | null
          school_id: string
          subject_id: string
          term_id?: string | null
          title: string
        }
        Update: {
          assessment_type?: string | null
          class_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_oral?: boolean | null
          max_score?: number | null
          school_id?: string
          subject_id?: string
          term_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          class_id: string | null
          created_at: string | null
          date: string
          id: string
          recorded_by: string | null
          remarks: string | null
          school_id: string
          status: string | null
          student_id: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          recorded_by?: string | null
          remarks?: string | null
          school_id: string
          status?: string | null
          student_id: string
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          recorded_by?: string | null
          remarks?: string | null
          school_id?: string
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          capacity: number | null
          created_at: string | null
          id: string
          level_id: string
          name: string
          school_id: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          level_id: string
          name: string
          school_id: string
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          level_id?: string
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "academic_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_categories: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          name: string
          school_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          school_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_categories_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_plans: {
        Row: {
          activities: string | null
          assessment_method: string | null
          class_id: string | null
          content: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          lesson_date: string | null
          materials: string | null
          objectives: string | null
          school_id: string
          status: string | null
          subject_id: string | null
          teacher_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          activities?: string | null
          assessment_method?: string | null
          class_id?: string | null
          content?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          lesson_date?: string | null
          materials?: string | null
          objectives?: string | null
          school_id: string
          status?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          activities?: string | null
          assessment_method?: string | null
          class_id?: string | null
          content?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          lesson_date?: string | null
          materials?: string | null
          objectives?: string | null
          school_id?: string
          status?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_plans_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_plans_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_plans_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_plans_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string | null
          school_id: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          school_id: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          school_id?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_students: {
        Row: {
          created_at: string
          id: string
          parent_id: string
          relationship: string | null
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_id: string
          relationship?: string | null
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_id?: string
          relationship?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_analytics: {
        Row: {
          active_schools: number | null
          created_at: string | null
          date: string | null
          id: string
          total_revenue: number | null
          total_schools: number | null
          total_students: number | null
          total_teachers: number | null
        }
        Insert: {
          active_schools?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          total_revenue?: number | null
          total_schools?: number | null
          total_students?: number | null
          total_teachers?: number | null
        }
        Update: {
          active_schools?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          total_revenue?: number | null
          total_schools?: number | null
          total_students?: number | null
          total_teachers?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          school_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          school_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          school_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      quran_memorization: {
        Row: {
          created_at: string | null
          hizb_number: number | null
          id: string
          juz_number: number | null
          memorization_date: string | null
          quality_rating: number | null
          revision_date: string | null
          school_id: string
          status: string | null
          student_id: string
          surah_name: string | null
          surah_number: number | null
          teacher_id: string | null
          teacher_remarks: string | null
          teacher_verified: boolean | null
          verses_from: number | null
          verses_to: number | null
        }
        Insert: {
          created_at?: string | null
          hizb_number?: number | null
          id?: string
          juz_number?: number | null
          memorization_date?: string | null
          quality_rating?: number | null
          revision_date?: string | null
          school_id: string
          status?: string | null
          student_id: string
          surah_name?: string | null
          surah_number?: number | null
          teacher_id?: string | null
          teacher_remarks?: string | null
          teacher_verified?: boolean | null
          verses_from?: number | null
          verses_to?: number | null
        }
        Update: {
          created_at?: string | null
          hizb_number?: number | null
          id?: string
          juz_number?: number | null
          memorization_date?: string | null
          quality_rating?: number | null
          revision_date?: string | null
          school_id?: string
          status?: string | null
          student_id?: string
          surah_name?: string | null
          surah_number?: number | null
          teacher_id?: string | null
          teacher_remarks?: string | null
          teacher_verified?: boolean | null
          verses_from?: number | null
          verses_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quran_memorization_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quran_memorization_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quran_memorization_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      result_check_tokens: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_used: boolean | null
          school_id: string
          session_id: string | null
          term_id: string | null
          token: string
          used_at: string | null
          used_by_registration: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_used?: boolean | null
          school_id: string
          session_id?: string | null
          term_id?: string | null
          token: string
          used_at?: string | null
          used_by_registration?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_used?: boolean | null
          school_id?: string
          session_id?: string | null
          term_id?: string | null
          token?: string
          used_at?: string | null
          used_by_registration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "result_check_tokens_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "result_check_tokens_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "result_check_tokens_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      scheme_of_work: {
        Row: {
          class_id: string | null
          created_at: string
          id: string
          objectives: string | null
          reference_materials: string | null
          remarks: string | null
          school_id: string
          sub_topic: string | null
          subject_id: string | null
          teacher_id: string | null
          teaching_aids: string | null
          term_id: string | null
          topic: string
          updated_at: string
          week_number: number
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          id?: string
          objectives?: string | null
          reference_materials?: string | null
          remarks?: string | null
          school_id: string
          sub_topic?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          teaching_aids?: string | null
          term_id?: string | null
          topic: string
          updated_at?: string
          week_number: number
        }
        Update: {
          class_id?: string | null
          created_at?: string
          id?: string
          objectives?: string | null
          reference_materials?: string | null
          remarks?: string | null
          school_id?: string
          sub_topic?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          teaching_aids?: string | null
          term_id?: string | null
          topic?: string
          updated_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "scheme_of_work_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_of_work_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_of_work_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_of_work_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_of_work_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      school_modules: {
        Row: {
          attendance_enabled: boolean | null
          created_at: string | null
          fees_management_enabled: boolean | null
          hostel_enabled: boolean | null
          id: string
          library_enabled: boolean | null
          memorization_tracking_enabled: boolean | null
          parent_portal_enabled: boolean | null
          school_id: string
          transport_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          attendance_enabled?: boolean | null
          created_at?: string | null
          fees_management_enabled?: boolean | null
          hostel_enabled?: boolean | null
          id?: string
          library_enabled?: boolean | null
          memorization_tracking_enabled?: boolean | null
          parent_portal_enabled?: boolean | null
          school_id: string
          transport_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          attendance_enabled?: boolean | null
          created_at?: string | null
          fees_management_enabled?: boolean | null
          hostel_enabled?: boolean | null
          id?: string
          library_enabled?: boolean | null
          memorization_tracking_enabled?: boolean | null
          parent_portal_enabled?: boolean | null
          school_id?: string
          transport_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_modules_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          academic_structure:
            | Database["public"]["Enums"]["academic_structure"]
            | null
          address: string | null
          assessment_style:
            | Database["public"]["Enums"]["assessment_style"]
            | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          grading_system: Database["public"]["Enums"]["grading_system"] | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          school_type: Database["public"]["Enums"]["school_type"]
          show_average: boolean | null
          show_grade: boolean | null
          show_position: boolean | null
          state: string | null
          status: Database["public"]["Enums"]["school_status"] | null
          subscription_expires_at: string | null
          subscription_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          academic_structure?:
            | Database["public"]["Enums"]["academic_structure"]
            | null
          address?: string | null
          assessment_style?:
            | Database["public"]["Enums"]["assessment_style"]
            | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          grading_system?: Database["public"]["Enums"]["grading_system"] | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          school_type?: Database["public"]["Enums"]["school_type"]
          show_average?: boolean | null
          show_grade?: boolean | null
          show_position?: boolean | null
          state?: string | null
          status?: Database["public"]["Enums"]["school_status"] | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_structure?:
            | Database["public"]["Enums"]["academic_structure"]
            | null
          address?: string | null
          assessment_style?:
            | Database["public"]["Enums"]["assessment_style"]
            | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          grading_system?: Database["public"]["Enums"]["grading_system"] | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          school_type?: Database["public"]["Enums"]["school_type"]
          show_average?: boolean | null
          show_grade?: boolean | null
          show_position?: boolean | null
          state?: string | null
          status?: Database["public"]["Enums"]["school_status"] | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_payments: {
        Row: {
          amount: number
          created_at: string | null
          fee_category_id: string | null
          id: string
          payment_date: string | null
          payment_method: string | null
          reference: string | null
          school_id: string
          status: string | null
          student_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          fee_category_id?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          reference?: string | null
          school_id: string
          status?: string | null
          student_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          fee_category_id?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          reference?: string | null
          school_id?: string
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_payments_fee_category_id_fkey"
            columns: ["fee_category_id"]
            isOneToOne: false
            referencedRelation: "fee_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_payments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_registration_tokens: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          id: string
          is_used: boolean | null
          max_uses: number | null
          school_id: string
          token: string
          used_at: string | null
          used_by_name: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          id?: string
          is_used?: boolean | null
          max_uses?: number | null
          school_id: string
          token: string
          used_at?: string | null
          used_by_name?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          id?: string
          is_used?: boolean | null
          max_uses?: number | null
          school_id?: string
          token?: string
          used_at?: string | null
          used_by_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_registration_tokens_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      student_scores: {
        Row: {
          assessment_id: string
          created_at: string | null
          id: string
          recorded_by: string | null
          remarks: string | null
          score: number | null
          student_id: string
        }
        Insert: {
          assessment_id: string
          created_at?: string | null
          id?: string
          recorded_by?: string | null
          remarks?: string | null
          score?: number | null
          student_id: string
        }
        Update: {
          assessment_id?: string
          created_at?: string | null
          id?: string
          recorded_by?: string | null
          remarks?: string | null
          score?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_scores_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_scores_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_subject_results: {
        Row: {
          ca1_score: number | null
          ca2_score: number | null
          created_at: string | null
          exam_score: number | null
          grade: string | null
          id: string
          remarks: string | null
          subject_id: string | null
          subject_name: string
          term_result_id: string
          total_score: number | null
        }
        Insert: {
          ca1_score?: number | null
          ca2_score?: number | null
          created_at?: string | null
          exam_score?: number | null
          grade?: string | null
          id?: string
          remarks?: string | null
          subject_id?: string | null
          subject_name: string
          term_result_id: string
          total_score?: number | null
        }
        Update: {
          ca1_score?: number | null
          ca2_score?: number | null
          created_at?: string | null
          exam_score?: number | null
          grade?: string | null
          id?: string
          remarks?: string | null
          subject_id?: string | null
          subject_name?: string
          term_result_id?: string
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_subject_results_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_subject_results_term_result_id_fkey"
            columns: ["term_result_id"]
            isOneToOne: false
            referencedRelation: "student_term_results"
            referencedColumns: ["id"]
          },
        ]
      }
      student_term_results: {
        Row: {
          attendance_present: number | null
          attendance_total: number | null
          average_score: number | null
          behavioral_ratings: Json | null
          class_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_published: boolean | null
          out_of: number | null
          position: number | null
          principal_remarks: string | null
          school_id: string
          session_id: string | null
          student_id: string
          teacher_remarks: string | null
          term_id: string | null
          total_score: number | null
          updated_at: string | null
        }
        Insert: {
          attendance_present?: number | null
          attendance_total?: number | null
          average_score?: number | null
          behavioral_ratings?: Json | null
          class_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          out_of?: number | null
          position?: number | null
          principal_remarks?: string | null
          school_id: string
          session_id?: string | null
          student_id: string
          teacher_remarks?: string | null
          term_id?: string | null
          total_score?: number | null
          updated_at?: string | null
        }
        Update: {
          attendance_present?: number | null
          attendance_total?: number | null
          average_score?: number | null
          behavioral_ratings?: Json | null
          class_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          out_of?: number | null
          position?: number | null
          principal_remarks?: string | null
          school_id?: string
          session_id?: string | null
          student_id?: string
          teacher_remarks?: string | null
          term_id?: string | null
          total_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_term_results_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_term_results_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_term_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_term_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_term_results_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          admission_date: string | null
          class_id: string | null
          created_at: string | null
          date_of_birth: string | null
          gender: string | null
          guardian_email: string | null
          guardian_name: string | null
          guardian_phone: string | null
          id: string
          registration_number: string | null
          school_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          admission_date?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          gender?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          registration_number?: string | null
          school_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          admission_date?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          gender?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          registration_number?: string | null
          school_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          category: string | null
          code: string | null
          created_at: string | null
          id: string
          is_islamic: boolean | null
          is_vocational: boolean | null
          name: string
          school_id: string
        }
        Insert: {
          category?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          is_islamic?: boolean | null
          is_vocational?: boolean | null
          name: string
          school_id: string
        }
        Update: {
          category?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          is_islamic?: boolean | null
          is_vocational?: boolean | null
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_classes: {
        Row: {
          class_id: string
          created_at: string | null
          id: string
          is_class_teacher: boolean | null
          teacher_id: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
          is_class_teacher?: boolean | null
          teacher_id: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
          is_class_teacher?: boolean | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string | null
          date_joined: string | null
          employee_id: string | null
          id: string
          qualification: string | null
          school_id: string
          specialization: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_joined?: string | null
          employee_id?: string | null
          id?: string
          qualification?: string | null
          school_id: string
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_joined?: string | null
          employee_id?: string | null
          id?: string
          qualification?: string | null
          school_id?: string
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      timetable: {
        Row: {
          class_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          period_number: number | null
          room_name: string | null
          school_id: string
          start_time: string
          subject_id: string | null
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          period_number?: number | null
          room_name?: string | null
          school_id: string
          start_time: string
          subject_id?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          period_number?: number | null
          room_name?: string | null
          school_id?: string
          start_time?: string
          subject_id?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timetable_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          school_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _school_id?: string
          _user_id: string
        }
        Returns: undefined
      }
      create_school_modules: {
        Args: { _memorization_enabled?: boolean; _school_id: string }
        Returns: undefined
      }
      get_user_school_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_parent_of_student: {
        Args: { _parent_id: string; _student_id: string }
        Returns: boolean
      }
      link_profile_to_school: {
        Args: {
          _full_name?: string
          _phone?: string
          _school_id: string
          _user_id: string
        }
        Returns: undefined
      }
      register_school: {
        Args: {
          _address: string
          _admin_name: string
          _admin_phone: string
          _admin_user_id: string
          _city: string
          _email: string
          _memorization_enabled?: boolean
          _phone: string
          _school_name: string
          _school_type: Database["public"]["Enums"]["school_type"]
          _state: string
        }
        Returns: string
      }
    }
    Enums: {
      academic_structure:
        | "term_based"
        | "semester_based"
        | "continuous"
        | "course_based"
      app_role:
        | "super_admin"
        | "school_admin"
        | "teacher"
        | "student"
        | "parent"
      assessment_style:
        | "exam_based"
        | "oral_based"
        | "memorization_based"
        | "mixed"
        | "skill_based"
      grading_system:
        | "percentage"
        | "gpa"
        | "cgpa"
        | "descriptive"
        | "level_based"
      school_status: "pending" | "approved" | "suspended" | "expired"
      school_type:
        | "nursery_primary"
        | "secondary"
        | "islamiyya"
        | "tahfiz"
        | "college_of_education"
        | "polytechnic"
        | "university"
        | "vocational"
        | "adult_education"
      subscription_plan: "free" | "basic" | "premium" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      academic_structure: [
        "term_based",
        "semester_based",
        "continuous",
        "course_based",
      ],
      app_role: ["super_admin", "school_admin", "teacher", "student", "parent"],
      assessment_style: [
        "exam_based",
        "oral_based",
        "memorization_based",
        "mixed",
        "skill_based",
      ],
      grading_system: [
        "percentage",
        "gpa",
        "cgpa",
        "descriptive",
        "level_based",
      ],
      school_status: ["pending", "approved", "suspended", "expired"],
      school_type: [
        "nursery_primary",
        "secondary",
        "islamiyya",
        "tahfiz",
        "college_of_education",
        "polytechnic",
        "university",
        "vocational",
        "adult_education",
      ],
      subscription_plan: ["free", "basic", "premium", "enterprise"],
    },
  },
} as const
