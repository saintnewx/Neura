// Типы публичной схемы Supabase. Даты PostgreSQL передаются как ISO-строки.
export type Plan = "free" | "pro" | "team";

export type Profile = {
  id: string;
  email: string | null;
  created_at: string;
  plan: Plan;
  generations_today: number;
  last_reset_date: string;
};

export type Generation = {
  id: string;
  user_id: string;
  task: string;
  type: string;
  tone: string;
  result: string;
  created_at: string;
};

export type DailyUsage = {
  used: number;
  limit: number;
  reset_date: string;
};

export type GenerationReservation = DailyUsage & { allowed: boolean };

// Структура совместима с createClient<Database> из @supabase/supabase-js.
// Update описывает SQL-строку; RLS и GRANT запрещают клиенту менять эти таблицы.
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email?: string | null;
          created_at?: string;
          plan?: Plan;
          generations_today?: number;
          last_reset_date?: string;
        };
        Update: Partial<Profile>;
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      generations: {
        Row: Generation;
        Insert: {
          id?: string;
          user_id: string;
          task: string;
          type: string;
          tone?: string;
          result: string;
          created_at?: string;
        };
        Update: Partial<Generation>;
        Relationships: [
          {
            foreignKeyName: "generations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      get_daily_usage: {
        Args: Record<string, never>;
        Returns: DailyUsage[];
      };
      reserve_generation: {
        Args: Record<string, never>;
        Returns: GenerationReservation[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
