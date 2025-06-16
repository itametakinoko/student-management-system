// ユーザープロフィールの型
export interface Profile {
  id: string
  name: string
  avatar_url?: string
  admission_year: number
  created_at?: string
  updated_at?: string
}

// 授業の型
export interface Course {
  id: string
  name: string
  code: string
  department: string
  created_at?: string
}

// ユーザーと授業の関連付けの型
export interface UserCourse {
  user_id: string
  course_id: string
  semester: string
  year: number
}

// 検索フィルターの型
export interface SearchFilters {
  name?: string
  admission_year?: number
  course_id?: string
  department?: string
}

// 登録フォームの型
export interface RegisterFormData {
  name: string
  admission_year: number
  avatar?: File
  courses: {
    course_id: string
    semester: string
    year: number
  }[]
}