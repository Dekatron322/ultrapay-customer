"use client"
import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { RxCaretDown, RxCross2 } from "react-icons/rx"

interface SearchModuleProps {
  value: string

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void

  onCancel?: () => void

  placeholder?: string

  className?: string

  searchType?: string

  onSearchTypeChange?: (type: string) => void

  searchTypeOptions?: {
    value: string
    label: string
  }[]

  bgClassName?: string
}

export const SearchModule: React.FC<SearchModuleProps> = ({
  value,
  onChange,
  onCancel,
  placeholder = "Search",
  className = "",
  searchType = "tag",
  onSearchTypeChange,
  searchTypeOptions = [
    { value: "tag", label: "Tag" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
  ],
  bgClassName = "bg-[#f9f9f9]",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get the current label for the selected search type
  const currentLabel = searchTypeOptions.find((opt) => opt.value === searchType)?.label || "Tag"

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleOptionClick = (value: string) => {
    if (onSearchTypeChange) {
      onSearchTypeChange(value)
    }
    setIsDropdownOpen(false)
  }

  return (
    <div
      className={`flex h-[40px] w-[380px] items-center justify-between gap-3 rounded-md border border-gray-300 bg-[#F3F4F6] px-0 text-[#707070] transition-all duration-200 focus-within:border-[#1447E6] focus-within:ring-2 focus-within:ring-[#1447E6]  hover:border-[#1447E6] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 ${bgClassName} ${className}`}
    >
      {/* Search type dropdown */}
      {onSearchTypeChange && (
        <div className="relative h-full" ref={dropdownRef}>
          <button
            type="button"
            className="flex h-full items-center justify-between rounded-l-md border-r border-gray-300 bg-[#F3F4F6] px-3 text-sm outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{currentLabel}</span>
            <RxCaretDown className={`ml-2 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown popover */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
              {searchTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    searchType === option.value ? "bg-gray-100 font-medium dark:bg-gray-700" : ""
                  }`}
                  onClick={() => handleOptionClick(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search input */}
      <div className="flex flex-1 items-center gap-2 px-3">
        <Image src="/DashboardImages/Search.svg" width={16} height={16} alt="Search Icon" />
        <input
          type="text"
          id="search"
          placeholder={placeholder}
          className="w-full bg-transparent text-gray-900 placeholder-gray-500 outline-none dark:text-white dark:placeholder-gray-400"
          value={value}
          onChange={onChange}
        />
        {value && onCancel && (
          <RxCross2
            onClick={onCancel}
            style={{ cursor: "pointer" }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          />
        )}
      </div>
    </div>
  )
}
