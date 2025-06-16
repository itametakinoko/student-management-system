import { Header } from "@/components/Header"
import { RegisterForm } from "@/components/forms/RegisterForm"

export default function RegisterPage() {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">学生登録</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}