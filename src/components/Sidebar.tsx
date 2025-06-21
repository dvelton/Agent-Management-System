import { ChartPieSlice, UsersThree, Clock, Shield, Files, Robot, ChartLine, Gear } from "@phosphor-icons/react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartPieSlice },
    { id: 'organization', label: 'Organization', icon: UsersThree },
    { id: 'lifecycle', label: 'Lifecycle', icon: Clock },
    { id: 'governance', label: 'Governance', icon: Shield },
    { id: 'divider' },
    { id: 'agents', label: 'Agent Directory', icon: Robot },
    { id: 'reports', label: 'Reports', icon: Files },
    { id: 'analytics', label: 'Analytics', icon: ChartLine },
    { id: 'divider' },
    { id: 'settings', label: 'Settings', icon: Gear },
  ]

  return (
    <aside className="w-[220px] border-r border-border bg-card hidden md:block shrink-0">
      <div className="py-6 flex flex-col h-full">
        <nav className="space-y-1 px-3 flex-1">
          {menuItems.map((item) => 
            item.id === 'divider' ? (
              <div key="divider" className="border-t border-border my-4"></div>
            ) : (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium w-full text-left transition-colors ${
                  activeTab === item.id 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            )
          )}
        </nav>
        
        <div className="px-3 py-4 mt-auto">
          <div className="rounded-md bg-primary/10 p-3 text-xs text-primary-foreground">
            <p className="font-medium">Pro Tip</p>
            <p className="mt-1 text-muted-foreground">
              Use the governance tab to manage agent permissions and authorities.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}