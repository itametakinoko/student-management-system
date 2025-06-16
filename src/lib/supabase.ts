import { createClient } from "@supabase/supabase-js"
import type { Profile, SearchFilters, UserCourse } from "./types"

// 環境変数からSupabaseの設定を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

console.log("Supabase URL Loaded:", supabaseUrl ? "OK" : "NG - URLが読み込めていません！");
console.log("Supabase Anon Key Loaded:", supabaseAnonKey ? "OK" : "NG - Anonキーが読み込めていません！");

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// プロフィール関連の関数
export const profilesService = {
  // プロフィール作成
  async createProfile(profile: Omit<Profile, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("profiles").insert([profile]).select().single()

    if (error) throw error
    return data
  },

  // プロフィール取得
  async getProfileById(id: string) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  // プロフィール検索
  async searchProfiles(filters: SearchFilters = {}) {
    let query = supabase.from("profiles").select("*")

    if (filters.name) {
      query = query.ilike("name", `%${filters.name}%`)
    }

    if (filters.admission_year) {
      query = query.eq("admission_year", filters.admission_year)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  // アバター画像アップロード
  async uploadAvatar(file: File, userId: string) {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}.${fileExt}`

    const { error } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true })

    if (error) throw error

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)
    return data.publicUrl
  },
}

// 授業関連の関数
export const coursesService = {
  // 全授業取得
  async getAllCourses() {
    const { data, error } = await supabase.from("courses").select("*")

    if (error) throw error
    return data
  },

  // ユーザーの履修授業を取得
  async getUserCourses(userId: string) {
    const { data, error } = await supabase
      .from("user_courses")
      .select(`
        course_id,
        semester,
        year,
        courses (
          id,
          name,
          code,
          department
        )
      `)
      .eq("user_id", userId)

    if (error) throw error
    return data
  },

  // ユーザーの履修授業を登録
  async registerUserCourses(userCourses: Omit<UserCourse, "id">[]) {
    const { data, error } = await supabase.from("user_courses").insert(userCourses)

    if (error) throw error
    return data
  },
}