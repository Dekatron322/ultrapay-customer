"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PasswordInputModule } from "components/ui/Input/PasswordInput"
import { ButtonModule } from "components/ui/Button/Button"
import { FormInputModule as EmailInput } from "components/ui/Input/EmailInput"
import TokenSelectionModal from "components/ui/Modal/TokenSelectionModal"
import { USDTIcon, USDCIcon, BTCIcon, ETHIcon, SolIcon, BNBIcon, FTMIcon } from "components/Icons/LogoIcons"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { VscLock } from "react-icons/vsc"
import { ThemeToggle } from "components/ui/ThemeToggle"
import Footer from "components/Footer/Footer"

const MakePayment: React.FC = () => {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedToken, setSelectedToken] = useState("")
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock exchange rates (in a real app, these would come from an API)
  const exchangeRates: { [key: string]: number } = {
    USDT: 1, // 1 USDT = 1 USD
    USDC: 1, // 1 USDC = 1 USD
    BTC: 45000, // 1 BTC = 45000 USD
    ETH: 3000, // 1 ETH = 3000 USD
    BNB: 300, // 1 BNB = 300 USD
    Solana: 100, // 1 SOL = 100 USD
    Fanthom: 0.5, // 1 FTM = 0.5 USD
  }

  // Assuming 1 USD = 750 NGN (mock rate)
  const ngnToUsdRate = 750

  const tokens = [
    { symbol: "USDT", name: "Tether", icon: "/icons/usdt.svg" },
    { symbol: "USDC", name: "USD Coin", icon: "/icons/usdc.svg" },
    { symbol: "BTC", name: "Bitcoin", icon: "/icons/btc.svg" },
    { symbol: "ETH", name: "Ethereum", icon: "/icons/eth.svg" },
    { symbol: "BNB", name: "Binance Coin", icon: "/icons/bnb.svg" },
    { symbol: "Solana", name: "Solana", icon: "/icons/solana.svg" },
    { symbol: "Fanthom", name: "FTM", icon: "/icons/ftm.svg" },
  ]

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

  const getTokenInfo = (symbol: string) => {
    return tokens.find((token) => token.symbol === symbol)
  }

  const calculateTokenEquivalent = (ngnAmount: string, tokenSymbol: string) => {
    if (!ngnAmount || !tokenSymbol) return null

    const amountInNumbers = parseFloat(ngnAmount.replace(/,/g, ""))
    if (isNaN(amountInNumbers)) return null

    const usdAmount = amountInNumbers / ngnToUsdRate
    const tokenRate = exchangeRates[tokenSymbol]
    if (!tokenRate || tokenRate === 0) return null

    const tokenAmount = usdAmount / tokenRate

    // Format the token amount based on its value
    if (tokenAmount < 0.001) {
      return tokenAmount.toPrecision(4)
    } else if (tokenAmount < 1) {
      return tokenAmount.toFixed(4)
    } else if (tokenAmount < 100) {
      return tokenAmount.toFixed(2)
    } else {
      return tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    // Basic validation
    if (!amount.trim() || amount.replace(/,/g, "").trim() === "" || !selectedToken) {
      setError("Please enter amount and select token")
      setLoading(false)
      return
    }

    // Calculate token equivalent
    const tokenEquivalent = calculateTokenEquivalent(amount, selectedToken)

    // Redirect to payment method selection page with payment details
    setTimeout(() => {
      setLoading(false)
      const params = new URLSearchParams({
        amount: amount.replace(/,/g, ""),
        token: selectedToken,
        tokenAmount: tokenEquivalent || "0",
        recipient: "BMA Studio!",
      })
      router.push(`/payment-method?${params.toString()}`)
    }, 1500)
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/,/g, "") // Remove existing commas

    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      // Format with commas for display
      if (value && !isNaN(Number(value))) {
        const parts = value.split(".")
        parts[0] = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ""
        value = parts.join(".")
      }
      setAmount(value)
    }

    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleWalletChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value)
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleTokenChange = (token: string) => {
    setSelectedToken(token)
    setIsTokenModalOpen(false)
    // Clear error when user selects a token
    if (error) setError(null)
  }

  const isButtonDisabled =
    loading || amount.trim() === "" || amount.replace(/,/g, "").trim() === "" || selectedToken === ""

  return (
    <div className="relative flex min-h-screen flex-col bg-radial-gradient from-[#E3ECFA] to-[#F5F7FE] dark:from-[#000B19] dark:to-[#040405]">
      {/* Fixed Header */}
      <div className="fixed left-0 right-0 top-0 z-10 ">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Image src="/ultra-pay/logo.png" alt="Logo" width={120} height={78} className="sm:w-[155px]" />
          <ThemeToggle />
        </div>
      </div>

      {/* Form Container */}
      <div className="flex w-full flex-1 items-center justify-center pt-16 sm:pt-20">
        <motion.main
          className="flex w-full max-w-lg flex-col items-center justify-center px-4 sm:px-6"
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
            <div className="-mx-4 mb-6 border-b pb-4 text-center dark:border-gray-800 sm:-mx-6 sm:mb-8 sm:pb-6">
              <div className="flex items-center justify-center">
                <Image
                  src="/ultra-pay/brand-logo.png"
                  alt="Logo"
                  width={50}
                  height={50}
                  className="sm:h-[60px] sm:w-[60px]"
                />
              </div>
              <p className="mt-2 text-sm text-[#101836] dark:text-gray-300 sm:text-base">Make Payment to:</p>
              <h1 className="text-xl font-medium text-[#1447E6] dark:text-blue-400 sm:text-2xl">BMA Studio!</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <div className="relative">
                  <div className="flex flex-col rounded-xl bg-[#F9FAFC] px-3 py-3 dark:bg-[#191d26] sm:px-4 sm:py-4">
                    <p className="block text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
                      You're Paying
                    </p>
                    <div className="flex items-center rounded-xl bg-[#F9FAFC] dark:bg-[#191d26]">
                      <input
                        type="text"
                        placeholder="0.00"
                        value={amount}
                        onChange={handleAmountChange}
                        className="flex-1 border-none bg-transparent text-lg text-gray-900 placeholder-gray-400 outline-none dark:text-white sm:text-xl"
                        required
                      />
                      <div className="flex items-center rounded-lg bg-[#F3F4F6] px-2 py-1.5 dark:bg-[#242f3f] sm:px-3 sm:py-2">
                        <Image src="/ultra-pay/NG.svg" alt="Naira" width={14} height={14} className="sm:h-4 sm:w-4" />
                        <p className="ml-1.5 text-xs font-medium text-gray-600 dark:text-[#ffffff] sm:ml-2 sm:text-sm">
                          NGN
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
                <div className="relative">
                  <div className="flex flex-col rounded-xl bg-[#F9FAFC] px-3 py-3 dark:bg-[#191d26] sm:px-4 sm:py-4">
                    <p className="block text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">Pay with</p>
                    <div className="flex items-center rounded-xl bg-[#F9FAFC] dark:bg-[#191d26]">
                      <button
                        type="button"
                        onClick={() => setIsTokenModalOpen(true)}
                        className="flex-1 border-none bg-transparent py-2 text-left text-lg text-gray-900 outline-none dark:text-white sm:text-xl"
                      >
                        {selectedToken ? (
                          <div className="flex flex-col">
                            {amount && (
                              <span className="mb-1 text-lg dark:text-white sm:text-xl">
                                {calculateTokenEquivalent(amount, selectedToken)} {selectedToken}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              1 NGN ={" "}
                              {exchangeRates[selectedToken]
                                ? (1 / (ngnToUsdRate * exchangeRates[selectedToken]!)).toPrecision(6)
                                : "N/A"}{" "}
                              {selectedToken}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-900 dark:text-white">0</span>
                        )}
                      </button>
                      {selectedToken ? (
                        <div
                          className="flex cursor-pointer items-center rounded-lg bg-[#F3F4F6] px-2 py-1.5 hover:bg-[#E5E7EB] dark:bg-[#242f3f] dark:hover:bg-[#374151] sm:px-3 sm:py-2"
                          onClick={() => setIsTokenModalOpen(true)}
                        >
                          {getTokenIcon(selectedToken)}
                          <span className="ml-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 sm:ml-2 sm:text-sm">
                            {selectedToken}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="flex cursor-pointer items-center rounded-lg bg-[#F3F4F6] px-2 py-1.5 hover:bg-[#E5E7EB] dark:bg-[#242f3f] dark:hover:bg-[#374151] sm:px-3 sm:py-2"
                          onClick={() => setIsTokenModalOpen(true)}
                        >
                          <span className="text-xs text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 sm:text-sm">
                            Select token
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-md bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
                <ButtonModule
                  variant="primary"
                  size="lg"
                  className="w-full transform py-2.5 font-medium transition-all hover:scale-[1.01] sm:py-3"
                  type="submit"
                  loading={loading}
                >
                  Continue
                </ButtonModule>
              </motion.div>
            </form>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-6 flex items-center justify-center gap-2 sm:mt-10"
            >
              <VscLock className="h-3 w-3 text-[#101836] dark:text-gray-300 sm:h-4 sm:w-4" />
              <p className="text-xs text-[#2d2f37] dark:text-gray-300 sm:text-sm">
                Payments secured by{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-[#1447E6] transition-all duration-200 ease-in-out hover:text-[#100A55] dark:text-blue-400 dark:hover:text-blue-300"
                >
                  UltraPay
                </Link>
              </p>
            </motion.div>

            {/* Demo credentials hint */}
          </motion.div>
        </motion.main>
      </div>
      <Footer />

      {/* Token Selection Modal */}
      <TokenSelectionModal
        isOpen={isTokenModalOpen}
        onRequestClose={() => setIsTokenModalOpen(false)}
        onTokenSelect={handleTokenChange}
        selectedToken={selectedToken}
        tokens={tokens}
      />
    </div>
  )
}

export default MakePayment
