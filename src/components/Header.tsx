import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          学生情報管理システム
        </Link>
        <nav className="flex gap-4">
          <Link href="/">
            <Button variant="ghost">ホーム</Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost">登録</Button>
          </Link>
          <Link href="/search">
            <Button variant="ghost">検索</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}