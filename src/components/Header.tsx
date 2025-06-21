import { Button } from "@/components/ui/button"
import { MagnifyingGlass, Bell, Gear } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

export function Header() {
  const [user, setUser] = useState<{ avatarUrl: string; login: string } | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const userInfo = await spark.user()
        setUser({
          avatarUrl: userInfo.avatarUrl,
          login: userInfo.login
        })
      } catch (error) {
        console.error("Failed to fetch user info:", error)
      }
    }
    
    fetchUser()
  }, [])

  return (
    <header className="bg-card border-b border-border px-6 py-3 sticky top-0 z-10 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          EAMS
        </div>
        <h1 className="text-lg font-medium text-foreground hidden md:block">
          Enterprise Agent Management System
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 py-1.5 pr-4 rounded-full bg-background border border-input w-[180px] lg:w-[240px] text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="outline" size="icon">
          <Gear className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback>{user?.login.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:block">{user?.login || 'User'}</span>
        </div>
      </div>
    </header>
  )
}