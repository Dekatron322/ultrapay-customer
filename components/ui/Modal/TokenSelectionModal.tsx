"use client"

import React from "react"
import Modal from "react-modal"
import { ButtonModule } from "../Button/Button"
import { USDTIcon, USDCIcon, BTCIcon, ETHIcon, SolIcon, BNBIcon, FTMIcon } from "components/Icons/LogoIcons"

interface Token {
  symbol: string
  name: string
  icon: string
}

interface TokenSelectionModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onTokenSelect: (token: string) => void
  selectedToken: string
  tokens: Token[]
}

const TokenSelectionModal: React.FC<TokenSelectionModalProps> = ({
  isOpen,
  onRequestClose,
  onTokenSelect,
  selectedToken,
  tokens,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTokenIcon = (symbol: string) => {
    switch (symbol) {
      case "USDT":
        return <USDTIcon size={40} />
      case "USDC":
        return <USDCIcon size={40} />
      case "BTC":
        return <BTCIcon size={40} />
      case "ETH":
        return <ETHIcon size={40} />
      case "Solana":
        return <SolIcon size={40} />
      case "BNB":
        return <BNBIcon size={40} />
      case "Fanthom":
        return <FTMIcon size={40} />
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
            <span className="text-sm font-bold">{symbol.charAt(0)}</span>
          </div>
        )
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="z-[999] mx-4 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg outline-none lg:mt-20 lg:w-[512px] lg:max-w-md dark:bg-[#13131b]"
      overlayClassName="fixed z-[999] inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F3F4F6] p-4 dark:bg-[#191d26]">
        <h2 className="text-lg font-bold text-[#101836] dark:text-gray-300">Select Token</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <svg
            className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Search Input */}
        <div className="mb-4 mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-[#1447E6] focus:outline-none dark:border-gray-600 dark:bg-[#191d26] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Token List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredTokens.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <svg
                className="h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No tokens found</p>
            </div>
          ) : (
            filteredTokens.map((token) => (
              <button
                key={token.symbol}
                type="button"
                onClick={() => onTokenSelect(token.symbol)}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-[#F9FAFC] dark:hover:bg-[#191d26]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full">
                  {getTokenIcon(token.symbol)}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[#101836] dark:text-gray-300">{token.symbol}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{token.name}</p>
                </div>
                {selectedToken === token.symbol && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1447E6]">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Cancel Button */}
        <div className="mt-4">
          <ButtonModule variant="secondary" size="lg" className="w-full" onClick={onRequestClose}>
            Cancel
          </ButtonModule>
        </div>
      </div>
    </Modal>
  )
}

export default TokenSelectionModal
