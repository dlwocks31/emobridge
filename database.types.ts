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
      backups: {
        Row: {
          content: string | null
          createdAt: string
          createdBy: string | null
          documentId: number
          id: number
        }
        Insert: {
          content?: string | null
          createdAt?: string
          createdBy?: string | null
          documentId: number
          id?: number
        }
        Update: {
          content?: string | null
          createdAt?: string
          createdBy?: string | null
          documentId?: number
          id?: number
        }
        Relationships: []
      }
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
          isHidden: boolean
          name: string
        }
        Insert: {
          courseId: number
          createdAt?: string
          id?: number
          isHidden?: boolean
          name: string
        }
        Update: {
          courseId?: number
          createdAt?: string
          id?: number
          isHidden?: boolean
          name?: string
        }
        Relationships: []
      }
      editorLogs: {
        Row: {
          blockContent: string | null
          createdAt: string
          createdBy: string
          documentId: number
          emojiClass: string
          emojiType: string | null
          id: number
          logType: string
          targetBlockId: string | null
        }
        Insert: {
          blockContent?: string | null
          createdAt?: string
          createdBy?: string
          documentId: number
          emojiClass: string
          emojiType?: string | null
          id?: number
          logType: string
          targetBlockId?: string | null
        }
        Update: {
          blockContent?: string | null
          createdAt?: string
          createdBy?: string
          documentId?: number
          emojiClass?: string
          emojiType?: string | null
          id?: number
          logType?: string
          targetBlockId?: string | null
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
