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
      admin_users: {
        Row: {
          user_id: string
          email: string
          created_at: string
        }
        Insert: {
          user_id: string
          email: string
          created_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          created_at?: string
        }
        Relationships: []
      }
      admin_csv_uploads: {
        Row: {
          id: string
          uploaded_by: string
          original_name: string
          stored_name: string
          size: number
          columns: string[]
          row_count: number
          preview_rows: Json
          uploaded_at: string
        }
        Insert: {
          id?: string
          uploaded_by: string
          original_name: string
          stored_name: string
          size: number
          columns: string[]
          row_count: number
          preview_rows?: Json
          uploaded_at?: string
        }
        Update: {
          id?: string
          uploaded_by?: string
          original_name?: string
          stored_name?: string
          size?: number
          columns?: string[]
          row_count?: number
          preview_rows?: Json
          uploaded_at?: string
        }
        Relationships: []
      }
      admin_csv_rows: {
        Row: {
          id: string
          upload_id: string
          row_number: number
          wilayah: string
          tahun: number
          gini_ratio: number
          tingkat_penganggur_terbuka: number
          rata_rata_inflasi_tahunan: number
          indeks_pembangunan_manusia: number
          persentase_kemiskinan: number
          priority_level: string
          raw_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          upload_id: string
          row_number: number
          wilayah: string
          tahun: number
          gini_ratio: number
          tingkat_penganggur_terbuka: number
          rata_rata_inflasi_tahunan: number
          indeks_pembangunan_manusia: number
          persentase_kemiskinan: number
          priority_level: string
          raw_data: Json
          created_at?: string
        }
        Update: {
          id?: string
          upload_id?: string
          row_number?: number
          wilayah?: string
          tahun?: number
          gini_ratio?: number
          tingkat_penganggur_terbuka?: number
          rata_rata_inflasi_tahunan?: number
          indeks_pembangunan_manusia?: number
          persentase_kemiskinan?: number
          priority_level?: string
          raw_data?: Json
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
