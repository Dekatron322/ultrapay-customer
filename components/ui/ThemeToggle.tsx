"use client"
import { Moon, Sun, Monitor } from "lucide-react"
import { useState, useEffect } from "react"

import { ButtonModule } from "components/ui/Button/Button"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex gap-2 rounded-lg bg-white p-2 dark:bg-gray-800">
        {["light", "dark", "system"].map((name) => (
          <div key={name} className="h-10 w-10" />
        ))}
      </div>
    )
  }

  const themes = [
    { name: "light", icon: Sun },
    { name: "dark", icon: Moon },
    { name: "system", icon: Monitor },
  ]

  return (
    <div className="flex gap-2 rounded-lg bg-white p-2  dark:bg-gray-800">
      {themes.map(({ name, icon: Icon }) => (
        <ButtonModule
          key={name}
          variant={theme === name ? "primary" : "ghost"}
          size="sm"
          onClick={() => setTheme(name)}
          className={`h-10 w-10 p-0 ${theme === name ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-400"}`}
        >
          <Icon className="h-6 w-6" />
        </ButtonModule>
      ))}
    </div>
  )
}
