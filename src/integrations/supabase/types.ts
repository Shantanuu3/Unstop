export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          address: string
          phone: string | null
          bio: string | null
          profile_photo_url: string | null
          is_verified: boolean | null
          is_business: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          address: string
          phone?: string | null
          bio?: string | null
          profile_photo_url?: string | null
          is_verified?: boolean | null
          is_business?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          address?: string
          phone?: string | null
          bio?: string | null
          profile_photo_url?: string | null
          is_verified?: boolean | null
          is_business?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          photo_url: string | null
          category: string | null
          like_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          photo_url?: string | null
          category?: string | null
          like_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          photo_url?: string | null
          category?: string | null
          like_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string | null
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      marketplace_items: {
        Row: {
          id: string
          seller_id: string
          title: string
          description: string | null
          price: number | null
          photo_url: string | null
          category: string | null
          condition: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          seller_id: string
          title: string
          description?: string | null
          price?: number | null
          photo_url?: string | null
          category?: string | null
          condition?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          seller_id?: string
          title?: string
          description?: string | null
          price?: number | null
          photo_url?: string | null
          category?: string | null
          condition?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          id: string
          provider_id: string
          name: string
          description: string | null
          hourly_rate: number | null
          category: string | null
          availability: Json | null
          photo_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          provider_id: string
          name: string
          description?: string | null
          hourly_rate?: number | null
          category?: string | null
          availability?: Json | null
          photo_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          provider_id?: string
          name?: string
          description?: string | null
          hourly_rate?: number | null
          category?: string | null
          availability?: Json | null
          photo_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          service_id: string
          customer_id: string
          booking_date: string | null
          start_time: string | null
          duration: number | null
          special_instructions: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          service_id: string
          customer_id: string
          booking_date?: string | null
          start_time?: string | null
          duration?: number | null
          special_instructions?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          service_id?: string
          customer_id?: string
          booking_date?: string | null
          start_time?: string | null
          duration?: number | null
          special_instructions?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          item_id: string | null
          content: string
          created_at: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          item_id?: string | null
          content: string
          created_at?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          item_id?: string | null
          content?: string
          created_at?: string | null
        }
        Relationships: []
      }
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
          content: string
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          category: string | null
          condition: string | null
          created_at: string | null
          description: string | null
          id: string
          photo_url: string | null
          price: number | null
          seller_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          photo_url?: string | null
          price?: number | null
          seller_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          photo_url?: string | null
          price?: number | null
          seller_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          description: string | null
          category: string | null
          phone: string | null
          website: string | null
          hours: string | null
          logo_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          description?: string | null
          category?: string | null
          phone?: string | null
          website?: string | null
          hours?: string | null
          logo_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          description?: string | null
          category?: string | null
          phone?: string | null
          website?: string | null
          hours?: string | null
          logo_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      poll_votes: {
        Row: {
          id: string
          poll_id: string
          user_id: string
          option_ids: string[]
          created_at: string | null
          id: string
          like_count: number | null
          photo_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          photo_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          photo_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string
          bio: string | null
          created_at: string | null
          id: string
          is_business: boolean | null
          is_verified: boolean | null
          name: string
          phone: string | null
          profile_photo_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          bio?: string | null
          created_at?: string | null
          id?: string
          is_business?: boolean | null
          is_verified?: boolean | null
          name: string
          phone?: string | null
          profile_photo_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          bio?: string | null
          created_at?: string | null
          id?: string
          is_business?: boolean | null
          is_verified?: boolean | null
          name?: string
          phone?: string | null
          profile_photo_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          availability: Json | null
          category: string | null
        }
        Insert: {
          id?: string
          poll_id: string
          user_id: string
          option_ids: string[]
          created_at?: string | null
        }
        Update: {
          id?: string
          poll_id?: string
          user_id?: string
          option_ids?: string[]
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
          availability?: Json | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          name: string
          photo_url?: string | null
          provider_id: string
          updated_at?: string | null
        }
        Update: {
          availability?: Json | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          name?: string
          photo_url?: string | null
          provider_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
