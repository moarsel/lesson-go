export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      lessons: {
        Row: {
          content: Json | null;
          created_at: string | null;
          id: number;
          subject: string | null;
          title: string | null;
          user_id: string | null;
        };
        Insert: {
          content?: Json | null;
          created_at?: string | null;
          id?: number;
          subject?: string | null;
          title?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: Json | null;
          created_at?: string | null;
          id?: number;
          subject?: string | null;
          title?: string | null;
          user_id?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
