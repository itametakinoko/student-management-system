import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 入学年度の選択肢を生成（現在から10年前まで）
export function getAdmissionYearOptions() {
  const currentYear = new Date().getFullYear()
  const years: number[] = []

  for (let i = 0; i <= 10; i++) {
    years.push(currentYear - i)
  }

  return years
}

// 学期の選択肢
export const SEMESTER_OPTIONS = [
  { value: "春学期", label: "春学期" },
  { value: "秋学期", label: "秋学期" },
  { value: "通年", label: "通年" },
]

// 学部の選択肢
export const DEPARTMENT_OPTIONS = [
  { value: "情報工学", label: "情報工学" },
  { value: "外国語", label: "外国語" },
  { value: "数学", label: "数学" },
  { value: "経営学", label: "経営学" },
  { value: "その他", label: "その他" },
]