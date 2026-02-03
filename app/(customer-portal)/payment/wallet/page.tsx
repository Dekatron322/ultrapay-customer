"use client"
import React, { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { useTheme } from "next-themes"
import { ButtonModule } from "components/ui/Button/Button"
import { ThemeToggle } from "components/ui/ThemeToggle"
import Footer from "components/Footer/Footer"
import { SearchModule } from "components/ui/Search/search-module"
import {
  USDTIcon,
  USDCIcon,
  BTCIcon,
  ETHIcon,
  SolIcon,
  BNBIcon,
  FTMIcon,
  UltraIconLight,
  UltraIconDark,
  WalletConnectLight,
  BinanceWallet,
  PolygonChain,
  TronChain,
  SeiChain,
} from "components/Icons/LogoIcons"
import { formatCurrency } from "utils/formatCurrency"
import { ArrowLeft, Clock, Zap, Shield, QrCode, Copy, CheckCircle } from "lucide-react"

const WalletPaymentWrapper: React.FC = () => {
  const searchParams = useSearchParams()

  return <WalletPayment searchParams={searchParams} />
}

const WalletPayment: React.FC<{ searchParams: ReturnType<typeof useSearchParams> }> = ({ searchParams }) => {
  const router = useRouter()
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)
  const [selectedChain, setSelectedChain] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAllChains, setShowAllChains] = useState(false)

  // Get payment details from URL params
  const amount = searchParams.get("amount") || "250,000"
  const token = searchParams.get("token") || "USDT"
  const tokenAmount = searchParams.get("tokenAmount") || "169.56"
  const recipient = searchParams.get("recipient") || "BMA Studio!"

  // Get available chains based on token type
  const getAvailableChains = (tokenSymbol: string) => {
    const chains = {
      USDT: [
        { id: "ethereum", name: "Ethereum", icon: <ETHIcon size={20} /> },
        { id: "binance", name: "Binance Smart Chain", icon: <BNBIcon size={20} /> },
        { id: "tron", name: "TRC (20)", icon: <TronChain size={20} /> },
        { id: "polygon", name: "Polygon", icon: <PolygonChain size={20} /> },
        { id: "solana", name: "Solana", icon: <SolIcon size={20} /> },
        { id: "sei", name: "Sei Chain", icon: <SeiChain size={20} /> },
      ],
      USDC: [
        { id: "ethereum", name: "Ethereum", icon: <ETHIcon size={20} /> },
        { id: "binance", name: "Binance Smart Chain", icon: <BNBIcon size={20} /> },
        { id: "tron", name: "TRC (20)", icon: <TronChain size={20} /> },
        { id: "polygon", name: "Polygon", icon: <PolygonChain size={20} /> },
        { id: "solana", name: "Solana", icon: <SolIcon size={20} /> },
        { id: "sei", name: "Sei Chain", icon: <SeiChain size={20} /> },
      ],
      BTC: [
        { id: "ethereum", name: "Ethereum", icon: <ETHIcon size={20} /> },
        { id: "binance", name: "Binance Smart Chain", icon: <BNBIcon size={20} /> },
        { id: "tron", name: "TRC (20)", icon: <TronChain size={20} /> },
        { id: "polygon", name: "Polygon", icon: <PolygonChain size={20} /> },
        { id: "solana", name: "Solana", icon: <SolIcon size={20} /> },
        { id: "sei", name: "Sei Chain", icon: <SeiChain size={20} /> },
      ],
      ETH: [
        { id: "ethereum", name: "Ethereum", icon: <ETHIcon size={20} /> },
        { id: "binance", name: "Binance Smart Chain", icon: <BNBIcon size={20} /> },
        { id: "tron", name: "TRC (20)", icon: <TronChain size={20} /> },
        { id: "polygon", name: "Polygon", icon: <PolygonChain size={20} /> },
        { id: "solana", name: "Solana", icon: <SolIcon size={20} /> },
        { id: "sei", name: "Sei Chain", icon: <SeiChain size={20} /> },
      ],
      Solana: [
        { id: "ethereum", name: "Ethereum", icon: <ETHIcon size={20} /> },
        { id: "binance", name: "Binance Smart Chain", icon: <BNBIcon size={20} /> },
        { id: "tron", name: "TRC (20)", icon: <TronChain size={20} /> },
        { id: "polygon", name: "Polygon", icon: <PolygonChain size={20} /> },
        { id: "solana", name: "Solana", icon: <SolIcon size={20} /> },
        { id: "sei", name: "Sei Chain", icon: <SeiChain size={20} /> },
      ],
      BNB: [
        { id: "ethereum", name: "Ethereum", icon: <ETHIcon size={20} /> },
        { id: "binance", name: "Binance Smart Chain", icon: <BNBIcon size={20} /> },
        { id: "tron", name: "TRC (20)", icon: <TronChain size={20} /> },
        { id: "polygon", name: "Polygon", icon: <PolygonChain size={20} /> },
        { id: "solana", name: "Solana", icon: <SolIcon size={20} /> },
        { id: "sei", name: "Sei Chain", icon: <SeiChain size={20} /> },
      ],
      Fanthom: [{ id: "fantom", name: "Fantom", icon: <FTMIcon size={20} /> }],
    }
    return chains[tokenSymbol as keyof typeof chains] || chains.USDT
  }

  // Mock wallet addresses based on token type and chain
  const getWalletAddress = (tokenSymbol: string, chainId: string) => {
    const addresses = {
      "USDT-ethereum": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "USDT-tron": "TLyqzVGLV1srkB7dToLJEwL3gGv5G2m3a3",
      "USDT-binance": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "USDT-polygon": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "USDC-ethereum": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "USDC-binance": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "USDC-polygon": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "BTC-bitcoin": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      "ETH-ethereum": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "ETH-arbitrum": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "Solana-solana": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      "BNB-binance": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "Fanthom-fantom": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    }
    return addresses[`${tokenSymbol}-${chainId}` as keyof typeof addresses] || addresses["USDT-ethereum"]
  }

  const getTokenIcon = (symbol: string) => {
    switch (symbol) {
      case "USDT":
        return <USDTIcon size={24} />
      case "USDC":
        return <USDCIcon size={24} />
      case "BTC":
        return <BTCIcon size={24} />
      case "ETH":
        return <ETHIcon size={24} />
      case "Solana":
        return <SolIcon size={24} />
      case "BNB":
        return <BNBIcon size={24} />
      case "Fanthom":
        return <FTMIcon size={24} />
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
            <span className="text-sm font-bold">{symbol.charAt(0)}</span>
          </div>
        )
    }
  }

  const walletAddress = selectedChain ? getWalletAddress(token, selectedChain) : ""
  const qrCodeUrl = selectedChain
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`
    : ""
  const availableChains = getAvailableChains(token)

  // Filter chains based on search query - if searching, show all matches, otherwise show only first 4 or all if expanded
  const filteredChains = searchQuery
    ? availableChains.filter(
        (chain) =>
          chain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chain.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : showAllChains
    ? availableChains
    : availableChains.slice(0, 4)

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy address:", err)
    }
  }

  const handleChainSelect = (chainId: string) => {
    setSelectedChain(chainId)
    setSearchQuery("") // Clear search after selection
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchCancel = () => {
    setSearchQuery("")
    setShowAllChains(false) // Reset to show only 4 when search is cleared
  }

  const handleToggleShowAll = () => {
    setShowAllChains(!showAllChains)
  }

  const handleBack = () => {
    router.back()
  }

  const handlePaymentConfirmation = () => {
    // In a real app, this would verify the payment
    router.push("/payment/confirmation")
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-radial-gradient from-[#E3ECFA] to-[#F5F7FE] dark:from-[#000B19] dark:to-[#040405]">
      {/* Fixed Header */}
      <div className="fixed left-0 right-0 top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Image src="/ultra-pay/logo.png" alt="Logo" width={120} height={78} className="sm:w-[155px]" />
          <ThemeToggle />
        </div>
      </div>

      {/* Form Container */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-24 sm:pt-20">
        <motion.main
          className="flex w-full max-w-lg flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full rounded-2xl border border-[#F8F8F9] bg-white p-4 shadow-md dark:border-[#162131] dark:bg-[#13131b] sm:p-6"
          >
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <button
                onClick={handleBack}
                className="mb-2 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="text-sm sm:text-base">Back</span>
              </button>

              <h1 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">Send from Wallet</h1>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                Scan the QR code or copy the address to send payment
              </p>
            </div>

            {/* Payment Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-4 rounded-xl bg-[#F9FAFC] p-3 dark:bg-[#191d26] sm:mb-6 sm:p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="sm:hidden">{React.cloneElement(getTokenIcon(token), { size: 20 })}</div>
                  <div className="hidden sm:block">{getTokenIcon(token)}</div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Send</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white sm:text-lg">
                      {tokenAmount} {token}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Equivalent to</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white sm:text-lg">
                    {formatCurrency(amount, "₦")}
                  </p>
                </div>
              </div>
              <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700 sm:mt-3 sm:pt-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Image
                    src="/ultra-pay/brand-logo.png"
                    width={24}
                    height={24}
                    alt=""
                    className="sm:h-[30px] sm:w-[30px]"
                  />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">To</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white sm:text-base">{recipient}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Chain Selection */}
            {!selectedChain && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-4 sm:mb-6"
              >
                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300 sm:mb-3 sm:text-sm">
                  Select Blockchain Network
                </label>

                {/* Search Input */}
                <SearchModule
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onCancel={handleSearchCancel}
                  placeholder="Search chains..."
                  className="mb-3 !w-full sm:mb-4"
                  bgClassName="bg-[#f9f9f9] dark:bg-gray-800"
                  onSearchTypeChange={undefined}
                />

                <div className="space-y-1.5 sm:space-y-2">
                  {filteredChains.length > 0 ? (
                    filteredChains.map((chain) => (
                      <motion.div
                        key={chain.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + availableChains.indexOf(chain) * 0.1 }}
                        className={`cursor-pointer rounded-xl border p-2.5 transition-all sm:p-3 ${
                          selectedChain === chain.id
                            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                            : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-[#13131b] dark:hover:border-gray-600"
                        }`}
                        onClick={() => handleChainSelect(chain.id)}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="rounded-lg bg-blue-100 p-1.5 dark:bg-blue-900 sm:p-2">
                            <div className="sm:hidden">{React.cloneElement(chain.icon, { size: 16 })}</div>
                            <div className="hidden sm:block">{chain.icon}</div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                              {chain.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                              Send {token} on {chain.name} network
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-6 text-center sm:py-8">
                      <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                        {searchQuery ? `No chains found for "${searchQuery}"` : "No chains available"}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* QR Code Section - Only show after chain selection */}
            {selectedChain && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-4 sm:mb-6"
              >
                <div className="mb-3 flex justify-center sm:mb-4">
                  <div className="relative">
                    <div className="h-36 w-36 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 sm:h-48 sm:w-48 sm:p-4">
                      <img src={qrCodeUrl} alt="QR Code" className="h-full w-full object-contain" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 rounded-full bg-blue-500 p-1.5 text-white sm:p-2">
                      <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  Scan this QR code with your wallet app
                </p>
              </motion.div>
            )}

            {/* Wallet Address - Only show after chain selection */}
            {selectedChain && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mb-4 sm:mb-6"
              >
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300 sm:mb-2 sm:text-sm">
                  Wallet Address
                </label>
                <div className="relative">
                  <div className="flex items-center rounded-lg bg-gray-50 p-2.5 pr-10 dark:bg-gray-800 sm:p-3 sm:pr-12">
                    <p className="flex-1 truncate font-mono text-xs text-gray-900 dark:text-white sm:text-sm">
                      {walletAddress}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 transform p-1.5 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 sm:right-2 sm:p-2"
                  >
                    {copied ? (
                      <CheckCircle className="h-3 w-3 text-green-500 sm:h-4 sm:w-4" />
                    ) : (
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">Address copied to clipboard!</p>
                )}
              </motion.div>
            )}

            {/* Important Notes - Only show after chain selection */}
            {selectedChain && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20 sm:mb-6 sm:p-4"
              >
                <div className="flex items-start space-x-2">
                  <Clock className="mt-0.5 h-3 w-3 text-yellow-600 dark:text-yellow-400 sm:h-4 sm:w-4" />
                  <div>
                    <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 sm:text-sm">
                      Important Notes
                    </p>
                    <ul className="mt-1 space-y-0.5 text-xs text-yellow-700 dark:text-yellow-300 sm:space-y-1">
                      <li>
                        • Send exactly {tokenAmount} {token} to complete payment
                      </li>
                      <li>• Double-check the address before sending</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons - Only show after chain selection */}
            {selectedChain && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="space-y-2 sm:space-y-3"
              >
                <ButtonModule
                  variant="primary"
                  size="lg"
                  className="w-full transform py-2.5 font-medium transition-all hover:scale-[1.01] sm:py-3"
                  onClick={handlePaymentConfirmation}
                >
                  I've Sent the Payment
                </ButtonModule>
              </motion.div>
            )}

            {/* Security Note - Only show after chain selection */}
            {/* {selectedChain && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-6 flex items-center justify-center"
              >
                <Shield className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your payment is secured with blockchain technology
                </p>
              </motion.div>
            )} */}
          </motion.div>
        </motion.main>
      </div>
      <Footer />
    </div>
  )
}

export default function WalletPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WalletPaymentWrapper />
    </Suspense>
  )
}
