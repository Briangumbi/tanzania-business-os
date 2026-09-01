// Hand-written to match supabase/migrations/0001_init.sql.
// If you evolve the schema in Supabase, regenerate this with:
//   npx supabase gen types typescript --project-id <id> > lib/database.types.ts

export type Database = {
  public: {
    Tables: {
      shops: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          phone?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["shops"]["Insert"]>;
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          shop_id: string;
          name: string;
          phone: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          name: string;
          phone: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "customers_shop_id_fkey";
            columns: ["shop_id"];
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
        ];
      };
      credit_entries: {
        Row: {
          id: string;
          shop_id: string;
          customer_id: string;
          amount: number;
          description: string | null;
          entry_date: string;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          customer_id: string;
          amount: number;
          description?: string | null;
          entry_date?: string;
          due_date?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["credit_entries"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "credit_entries_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          shop_id: string;
          customer_id: string;
          amount: number;
          payment_date: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          customer_id: string;
          amount: number;
          payment_date?: string;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      activity_log: {
        Row: {
          id: string;
          shop_id: string;
          customer_id: string | null;
          customer_name: string;
          entity_type: string;
          action: string;
          summary: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          customer_id?: string | null;
          customer_name: string;
          entity_type: string;
          action: string;
          summary: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["activity_log"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "activity_log_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      customer_balances: {
        Row: {
          customer_id: string;
          shop_id: string;
          name: string;
          phone: string;
          notes: string | null;
          created_at: string;
          total_credit: number;
          total_paid: number;
          balance: number;
          last_entry_at: string | null;
          last_payment_at: string | null;
          last_activity_at: string | null;
          next_due_date: string | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
  };
};
