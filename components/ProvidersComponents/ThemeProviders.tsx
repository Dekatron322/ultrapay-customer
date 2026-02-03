"use client"
import React from "react"
import { ThemeProvider } from "next-themes"

interface ThemeProvidersProps {
  children: React.ReactNode
}

export default function ThemeProviders({ children }: ThemeProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
