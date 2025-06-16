"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { profilesService, coursesService } from "@/lib/supabase"
import { getAdmissionYearOptions, SEMESTER_OPTIONS } from "@/lib/utils"
import { toast } from "sonner"
import type { Course, RegisterFormData } from "@/lib/types"

export function RegisterForm() {
  const router = useRouter()

  // フォームの状態管理
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    admission_year: new Date().getFullYear(),
    courses: [],
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)

  // 授業一覧を取得
  useEffect(() => {
    async function fetchCourses() {
      try {
        const coursesData = await coursesService.getAllCourses()
        setCourses(coursesData)
      } catch (error) {
        console.error("授業データの取得に失敗しました:", error)
        toast.error("授業データの取得に失敗しました")
      } finally {
        setIsLoadingCourses(false)
      }
    }

    fetchCourses()
  }, [])

  // アバター画像の処理
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 履修授業の追加
  const addCourse = () => {
    setFormData((prev) => ({
      ...prev,
      courses: [
        ...prev.courses,
        {
          course_id: "",
          semester: "",
          year: new Date().getFullYear(),
        },
      ],
    }))
  }

  // 履修授業の削除
  const removeCourse = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index),
    }))
  }

  // 履修授業の更新
  const updateCourse = (index: number, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.map((course, i) => (i === index ? { ...course, [field]: value } : course)),
    }))
  }

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // プロフィール作成
      let avatarUrl = ""

      // アバター画像をアップロード
      if (avatarFile) {

         console.log("uploadAvatarに渡す直前のavatarFile:", avatarFile);

        avatarUrl = await profilesService.uploadAvatar(avatarFile, `temp-${Date.now()}`)
      }

      // プロフィールを作成
      const profile = await profilesService.createProfile({
        name: formData.name,
        admission_year: formData.admission_year,
        avatar_url: avatarUrl,
      })

      // 履修授業を登録
      if (formData.courses.length > 0) {
        const userCourses = formData.courses
          .filter((course) => course.course_id) // 空の授業は除外
          .map((course) => ({
            user_id: profile.id,
            course_id: course.course_id,
            semester: course.semester,
            year: course.year,
          }))

        if (userCourses.length > 0) {
          await coursesService.registerUserCourses(userCourses)
        }
      }

      toast.success("学生情報を登録しました")

      // 検索ページにリダイレクト
      router.push("/search")
    } catch (error) {
      console.error("登録エラー:", error)
      if (error instanceof Error) {
        toast.error(`登録に失敗しました: ${error.message}`)
      } else {
        toast.error("登録に失敗しました。もう一度お試しください。")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingCourses) {
    return <div>授業データを読み込み中...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-md">
      {/* 基本情報 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">基本情報</h2>

        {/* アバター */}
        <div>
          <Label htmlFor="avatar">プロフィール画像</Label>
          <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="mt-1" />
          {avatarPreview && (
            <div className="mt-2">
              <img
                src={avatarPreview || "/placeholder.svg"}
                alt="プレビュー"
                className="w-20 h-20 object-cover rounded-full"
              />
            </div>
          )}
        </div>

        {/* 名前 */}
        <div>
          <Label htmlFor="name">名前 *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
            placeholder="山田太郎"
          />
        </div>

        {/* 入学年度 */}
        <div>
          <Label htmlFor="admission_year">入学年度 *</Label>
          <Select
            value={formData.admission_year.toString()}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, admission_year: Number.parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getAdmissionYearOptions().map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}年度
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 履修授業 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">履修授業</h2>
          <Button type="button" onClick={addCourse} size="sm">
            授業を追加
          </Button>
        </div>

        {formData.courses.length === 0 ? (
          <p className="text-gray-500">履修授業を追加してください</p>
        ) : (
          formData.courses.map((course, index) => (
            <div key={index} className="flex gap-2 p-4 border rounded-md">
              <div className="flex-1">
                <Label>授業</Label>
                <Select value={course.course_id} onValueChange={(value) => updateCourse(index, "course_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="授業を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-32">
                <Label>学期</Label>
                <Select value={course.semester} onValueChange={(value) => updateCourse(index, "semester", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="学期" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-24">
                <Label>年度</Label>
                <Input
                  type="number"
                  value={course.year}
                  onChange={(e) => updateCourse(index, "year", Number.parseInt(e.target.value))}
                  min="2020"
                  max="2030"
                />
              </div>

              <Button type="button" variant="outline" size="sm" onClick={() => removeCourse(index)}>
                削除
              </Button>
            </div>
          ))
        )}
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/")}>
          キャンセル
        </Button>
        <Button type="submit" disabled={isLoading || !formData.name}>
          {isLoading ? "登録中..." : "登録する"}
        </Button>
      </div>
    </form>
  )
}