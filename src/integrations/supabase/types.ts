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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      employer_profiles: {
        Row: {
          company_description: string | null
          company_name: string
          company_size: string | null
          created_at: string
          id: string
          industry: string | null
          location: string | null
          reputation_score: number | null
          total_applications: number | null
          total_jobs_posted: number | null
          updated_at: string
          user_id: string
          verification_date: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          company_description?: string | null
          company_name: string
          company_size?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          location?: string | null
          reputation_score?: number | null
          total_applications?: number | null
          total_jobs_posted?: number | null
          updated_at?: string
          user_id: string
          verification_date?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          company_description?: string | null
          company_name?: string
          company_size?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          location?: string | null
          reputation_score?: number | null
          total_applications?: number | null
          total_jobs_posted?: number | null
          updated_at?: string
          user_id?: string
          verification_date?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_id: string
          applied_at: string
          id: string
          job_id: string
          status: string | null
        }
        Insert: {
          applicant_id: string
          applied_at?: string
          id?: string
          job_id: string
          status?: string | null
        }
        Update: {
          applicant_id?: string
          applied_at?: string
          id?: string
          job_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_flags: {
        Row: {
          created_at: string
          details: string | null
          flagger_id: string
          id: string
          job_id: string
          reason: string
          resolved: boolean | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          flagger_id: string
          id?: string
          job_id: string
          reason: string
          resolved?: boolean | null
        }
        Update: {
          created_at?: string
          details?: string | null
          flagger_id?: string
          id?: string
          job_id?: string
          reason?: string
          resolved?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "job_flags_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          applications: number | null
          category: Database["public"]["Enums"]["job_category"]
          clicks: number | null
          created_at: string
          employer_id: string
          engagement_score: number | null
          featured: boolean | null
          featured_until: string | null
          flagged_count: number | null
          freshness_score: number | null
          id: string
          job_description: string
          job_title: string
          location: string
          quality_score: number | null
          relevance_score: number | null
          remote_option: boolean | null
          salary_max: number | null
          salary_min: number | null
          saves: number | null
          shares: number | null
          skills: string[] | null
          status: Database["public"]["Enums"]["job_status"] | null
          trust_score: number | null
          updated_at: string
          visibility_score: number | null
        }
        Insert: {
          applications?: number | null
          category: Database["public"]["Enums"]["job_category"]
          clicks?: number | null
          created_at?: string
          employer_id: string
          engagement_score?: number | null
          featured?: boolean | null
          featured_until?: string | null
          flagged_count?: number | null
          freshness_score?: number | null
          id?: string
          job_description: string
          job_title: string
          location: string
          quality_score?: number | null
          relevance_score?: number | null
          remote_option?: boolean | null
          salary_max?: number | null
          salary_min?: number | null
          saves?: number | null
          shares?: number | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          trust_score?: number | null
          updated_at?: string
          visibility_score?: number | null
        }
        Update: {
          applications?: number | null
          category?: Database["public"]["Enums"]["job_category"]
          clicks?: number | null
          created_at?: string
          employer_id?: string
          engagement_score?: number | null
          featured?: boolean | null
          featured_until?: string | null
          flagged_count?: number | null
          freshness_score?: number | null
          id?: string
          job_description?: string
          job_title?: string
          location?: string
          quality_score?: number | null
          relevance_score?: number | null
          remote_option?: boolean | null
          salary_max?: number | null
          salary_min?: number | null
          saves?: number | null
          shares?: number | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          trust_score?: number | null
          updated_at?: string
          visibility_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_listings_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_visibility_score: {
        Args: { job_id: string }
        Returns: number
      }
    }
    Enums: {
      job_category:
        | "technology"
        | "healthcare"
        | "finance"
        | "education"
        | "marketing"
        | "sales"
        | "consulting"
        | "manufacturing"
        | "retail"
        | "hospitality"
        | "government"
        | "nonprofit"
        | "creative"
        | "other"
      job_status: "active" | "flagged" | "blocked" | "expired"
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
      job_category: [
        "technology",
        "healthcare",
        "finance",
        "education",
        "marketing",
        "sales",
        "consulting",
        "manufacturing",
        "retail",
        "hospitality",
        "government",
        "nonprofit",
        "creative",
        "other",
      ],
      job_status: ["active", "flagged", "blocked", "expired"],
    },
  },
} as const
