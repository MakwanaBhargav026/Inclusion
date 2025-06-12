"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, FileSearch, BarChart3, Settings, Users, FileText } from "lucide-react"

export function Sidebar({ isOpen }) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "Analyze", icon: FileSearch, path: "/dashboard/analyze" },
    { name: "My Reports", icon: FileText, path: "/dashboard/reports" },
    { name: "Statistics", icon: BarChart3, path: "/dashboard/statistics" },
    { name: "Team", icon: Users, path: "/dashboard/team" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ]

  const isActive = (path) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    return pathname.startsWith(path) && path !== "/dashboard"
  }

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-r border-slate-200 dark:border-slate-700 z-20 transition-all duration-300 ${
        isOpen ? "w-64" : "w-0 -translate-x-full md:w-16 md:translate-x-0"
      }`}
    >
      <div className="h-full flex flex-col py-4 overflow-y-auto">
        <nav className="flex-1 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 mr-3 transition-transform duration-200 ${isOpen ? "" : "md:mr-0 md:mx-auto"} ${
                      isActive(item.path)
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300"
                    }`}
                  />
                  <span className={`${isOpen ? "" : "md:hidden"}`}>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
