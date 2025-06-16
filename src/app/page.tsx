import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, UserPlus } from 'lucide-react'
import { Header } from "@/components/Header"

export default function HomePage() {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          {/* ヘッダー */}
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">学生情報管理システム</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              学生の基本情報と履修授業を管理し、条件に合う学生を簡単に検索できるシステムです
            </p>
          </div>

          {/* 機能カード */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 学生登録 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>学生登録</CardTitle>
                <CardDescription>新しい学生の基本情報と履修授業を登録します</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/register">
                  <Button className="w-full">学生を登録する</Button>
                </Link>
              </CardContent>
            </Card>

            {/* 学生検索 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>学生検索</CardTitle>
                <CardDescription>条件を指定して学生を検索・表示します</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/search">
                  <Button variant="outline" className="w-full">
                    学生を検索する
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 学生一覧 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>学生一覧</CardTitle>
                <CardDescription>登録されている全ての学生を一覧表示します</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/search">
                  <Button variant="secondary" className="w-full">
                    一覧を見る
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}