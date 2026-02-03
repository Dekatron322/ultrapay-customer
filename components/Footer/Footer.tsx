"use client"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import { FiSun } from "react-icons/fi"
import { IoMoonOutline } from "react-icons/io5"

const Footer = () => {
  const [isMoonIcon, setIsMoonIcon] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const toggleIcon = () => {
    setIsMoonIcon(!isMoonIcon)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  return (
    <div className="w-full bg-transparent px-4 py-3 sm:py-4">
      <p className="text-center text-xs text-[#4A5565] dark:text-gray-300 sm:text-sm">
        <span className="block sm:inline">If you'd like your business to also receive crypto payment...</span>
        <span className="block sm:inline-block sm:w-20"></span>
        <br className="sm:hidden" />
        <a
          href="#"
          className="font-medium text-[#1447E6] hover:text-[#100A55] dark:text-blue-400 dark:hover:text-blue-300"
        >
          Contact Ultra Pay
        </a>
      </p>
    </div>
  )
}

export default Footer
function setMounted(arg0: boolean) {
  throw new Error("Function not implemented.")
}
