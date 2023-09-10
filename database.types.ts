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
      courses: {
        Row: {
          createdAt: string
          id: number
          name: string
          userEmails: string[]
        }
        Insert: {
          createdAt?: string
          id?: number
          name: string
          userEmails: string[]
        }
        Update: {
          createdAt?: string
          id?: number
          name?: string
          userEmails?: string[]
        }
        Relationships: []
      }
      documents: {
        Row: {
          courseId: number
          createdAt: string
          id: number
          name: string
        }
        Insert: {
          courseId: number
          createdAt?: string
          id?: number
          name: string
        }
        Update: {
          courseId?: number
          createdAt?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      userRoles: {
        Row: {
          createdAt: string
          id: number
          userEmail: string
          userRole: string
        }
        Insert: {
          createdAt?: string
          id?: number
          userEmail: string
          userRole: string
        }
        Update: {
          createdAt?: string
          id?: number
          userEmail?: string
          userRole?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_permission: "channels.delete" | "messages.delete"
      app_role: "admin" | "moderator"
      user_status: "ONLINE" | "OFFLINE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
