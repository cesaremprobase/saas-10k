export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          order_number: string
          courier: string
          delivery_type: string
          delivery_address: string | null
          delivery_district: string | null
          delivery_reference: string | null
          recipient_name: string
          recipient_doc_type: string
          recipient_doc_number: string
          recipient_phone: string
          destination_department: string
          destination_province: string
          destination_agency: string
          package_content: string
          package_quantity: number
          payment_condition: string
          notes: string | null
          operator_name: string | null
          seller_phone: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          courier?: string
          delivery_type?: string
          delivery_address?: string | null
          delivery_district?: string | null
          delivery_reference?: string | null
          recipient_name: string
          recipient_doc_type?: string
          recipient_doc_number: string
          recipient_phone: string
          destination_department: string
          destination_province: string
          destination_agency: string
          package_content?: string
          package_quantity?: number
          payment_condition?: string
          notes?: string | null
          operator_name?: string | null
          seller_phone?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          courier?: string
          delivery_type?: string
          delivery_address?: string | null
          delivery_district?: string | null
          delivery_reference?: string | null
          recipient_name?: string
          recipient_doc_type?: string
          recipient_doc_number?: string
          recipient_phone?: string
          destination_department?: string
          destination_province?: string
          destination_agency?: string
          package_content?: string
          package_quantity?: number
          payment_condition?: string
          notes?: string | null
          operator_name?: string | null
          seller_phone?: string | null
          status?: string
          created_at?: string
          updated_at?: string
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
