"use client"
import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { useTheme } from "next-themes"
import { ButtonModule } from "components/ui/Button/Button"
import { ThemeToggle } from "components/ui/ThemeToggle"
import Footer from "components/Footer/Footer"
import DownloadAppModal from "components/DownloadAppModal/DownloadAppModal"
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
} from "components/Icons/LogoIcons"
import { formatCurrency } from "utils/formatCurrency"
import { ArrowLeft, Shield, QrCode } from "lucide-react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { mainnet, polygon, bsc, base, arbitrum, optimism } from "wagmi/chains"

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any & {
      isMetaMask?: boolean
      request?: (args: { method: string; params?: any[] }) => Promise<any>
      on?: (event: string, handler: (...args: any[]) => void) => void
      removeListener?: (event: string, handler: (...args: any[]) => void) => void
    }
  }
}

const PaymentMethodWrapper: React.FC = () => {
  const searchParams = useSearchParams()

  return <PaymentMethod searchParams={searchParams} />
}

const PaymentMethod: React.FC<{ searchParams: ReturnType<typeof useSearchParams> }> = ({ searchParams }) => {
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [selectedChain, setSelectedChain] = useState<number>(1) // Default to Ethereum
  const [loading, setLoading] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const { openConnectModal } = useConnectModal()
  const { isConnected, address, isConnecting, chain } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  // Fix for hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Available chains for selection
  const availableChains = [
    { id: 1, name: "Ethereum", icon: <ETHIcon size={20} />, type: "evm" },
    { id: 137, name: "Polygon", icon: <USDTIcon size={20} />, type: "evm" }, // Using USDT as placeholder for Polygon
    { id: 56, name: "BNB Chain", icon: <BNBIcon size={20} />, type: "evm" },
    { id: 8453, name: "Base", icon: <USDCIcon size={20} />, type: "evm" }, // Using USDC as placeholder for Base
    { id: 42161, name: "Arbitrum", icon: <SolIcon size={20} />, type: "evm" }, // Using Solana as placeholder for Arbitrum
    { id: 10, name: "Optimism", icon: <FTMIcon size={20} />, type: "evm" }, // Using FTM as placeholder for Optimism
    { id: 1329, name: "Sei", icon: <USDTIcon size={20} />, type: "evm" }, // Using USDT as placeholder for Sei
    { id: 59144, name: "Linea", icon: <USDCIcon size={20} />, type: "evm" },
  ]

  // Direct MetaMask connection using wagmi
  const connectMetaMaskDirectly = async (chainId?: number) => {
    const selectedChainData = availableChains.find((chain) => chain.id === (chainId || selectedChain))

    if (!selectedChainData) {
      alert("Invalid chain selection.")
      return
    }

    // Handle non-EVM chains
    if (selectedChainData.type === "tron") {
      alert("Tron requires TronLink wallet. Please install TronLink and select Tron network.")
      return
    }

    if (selectedChainData.type === "solana") {
      alert("Solana requires Phantom or Solflare wallet. Please install a Solana wallet to continue.")
      return
    }

    if (selectedChainData.type === "bitcoin") {
      alert("Bitcoin requires specialized Bitcoin wallets. Please use a Bitcoin wallet service.")
      return
    }

    // Handle EVM chains with MetaMask
    if (!window.ethereum?.isMetaMask) {
      alert("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    try {
      console.log("Attempting direct MetaMask connection via wagmi...")
      console.log("Target chain ID:", chainId || selectedChain)
      console.log("Chain type:", selectedChainData.type)

      // Use wagmi's connect method with injected connector
      await connect({
        connector: injected(),
        chainId: chainId || selectedChain,
      })

      console.log("wagmi connect called successfully")

      // Check connection status after a short delay
      setTimeout(() => {
        console.log("Checking wagmi connection after direct connect:")
        console.log("isConnected:", isConnected)
        console.log("address:", address)
        console.log("chain:", chain)
      }, 1000)
    } catch (error) {
      console.error("Direct MetaMask connection via wagmi failed:", error)

      // Type guard to check if error has a code property
      if (error && typeof error === "object" && "code" in error) {
        const errorCode = (error as { code: number }).code
        if (errorCode === 4001) {
          alert("MetaMask connection was rejected. Please try again and approve the connection.")
        } else if (errorCode === 4902) {
          alert(`The ${selectedChainData.name} network is not available in MetaMask. Please add it to MetaMask first.`)
        } else {
          alert("Failed to connect to MetaMask. Please check the console for details.")
        }
      } else {
        alert("Failed to connect to MetaMask. Please check the console for details.")
      }
    }
  }

  // Get payment details from URL params
  const amount = searchParams.get("amount") || "250,000"
  const token = searchParams.get("token") || "USDT"
  const tokenAmount = searchParams.get("tokenAmount") || "169.56"
  const recipient = searchParams.get("recipient") || "BMA Studio!"

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

  const paymentMethods = [
    {
      id: "wallet",
      title: "Send from Wallet",
      subtitle: "Recommended",
      description: "Manual transfer to payment address",
      icon: <QrCode className="h-5 w-5 text-[#1447e6] dark:text-gray-300" />,
      badge: "Recommended",
      badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      id: "ultra-app",
      title: "Pay with UltraApp",
      subtitle: "Fastest",
      description: "Fastest checkout experience",
      icon: resolvedTheme === "dark" ? <UltraIconDark size={20} /> : <UltraIconLight size={20} />,
      badge: "Fastest",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      id: "connect-wallet",
      title: "Wallet Connect",
      subtitle: isConnected ? "Connected" : "",
      description: isConnected
        ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)} ${chain?.name ? `(${chain.name})` : ""}`
        : "MetaMask, Wallet Connect and more",
      icon: <WalletConnectLight size={20} />,
      badge: isConnected ? "Connected" : null,
      badgeColor: isConnected ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "",
    },
    {
      id: "binance",
      title: "Binance Wallet",
      subtitle: "Soon",
      description: "Fastest checkout experience",
      icon: <BinanceWallet size={20} />,
      badge: "Soon",
      badgeColor: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      disabled: true,
    },
  ]

  const handleMethodSelect = (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId)
    if (!method?.disabled) {
      setSelectedMethod(methodId)

      if (methodId === "ultra-app") {
        setShowDownloadModal(true)
      } else if (methodId === "connect-wallet" && !isConnected) {
        console.log("Attempting to connect wallet...")
        console.log("openConnectModal available:", !!openConnectModal)
        console.log("isConnecting:", isConnecting)
        console.log("window.ethereum available:", !!window.ethereum)
        console.log("window.ethereum.isMetaMask:", window.ethereum?.isMetaMask)
        console.log("MetaMask provider details:", {
          isMetaMask: window.ethereum?.isMetaMask,
          chainId: window.ethereum?.chainId,
          selectedAddress: window.ethereum?.selectedAddress,
        })

        // First try RainbowKit modal
        if (openConnectModal) {
          try {
            console.log("Calling openConnectModal...")
            const result = openConnectModal()
            console.log("openConnectModal returned:", result)

            // Add a timeout to check if connection is established
            setTimeout(() => {
              console.log("Checking connection status after 3 seconds...")
              console.log("isConnected (timeout check):", isConnected)
              console.log("address (timeout check):", address)

              // If still not connected after 3 seconds, try direct MetaMask
              if (!isConnected && window.ethereum?.isMetaMask) {
                console.log("RainbowKit modal didn't connect, trying direct MetaMask...")
                connectMetaMaskDirectly(selectedChain)
              }
            }, 3000)
          } catch (error) {
            console.error("Error opening connect modal:", error)
            // Fallback to direct MetaMask connection
            if (window.ethereum?.isMetaMask) {
              console.log("RainbowKit failed, trying direct MetaMask...")
              connectMetaMaskDirectly(selectedChain)
            } else {
              alert("Failed to open wallet connection modal. Please check your browser console for details.")
            }
          }
        } else {
          // Fallback: Try direct MetaMask connection
          console.log("Wallet connect modal is not ready, trying direct MetaMask...")
          connectMetaMaskDirectly(selectedChain)
        }
      }
    }
  }

  const handleContinue = async () => {
    if (!selectedMethod) return

    console.log("handleContinue called with selectedMethod:", selectedMethod)
    console.log("isConnected:", isConnected)
    console.log("address:", address)
    console.log("chain:", chain)

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // Redirect based on selected method
      switch (selectedMethod) {
        case "wallet":
          router.push(
            `/payment/wallet?amount=${amount}&token=${token}&tokenAmount=${tokenAmount}&recipient=${recipient}`
          )
          break
        case "ultra-app":
          router.push(
            `/payment/ultra-app?amount=${amount}&token=${token}&tokenAmount=${tokenAmount}&recipient=${recipient}`
          )
          break
        case "connect-wallet":
          if (isConnected && address) {
            console.log("Wallet already connected, redirecting...")
            router.push(
              `/payment/connect-wallet?amount=${amount}&token=${token}&tokenAmount=${tokenAmount}&recipient=${recipient}&wallet=${address}&chain=${
                chain?.id || "1"
              }`
            )
          } else {
            console.log("Wallet not connected, attempting to connect...")
            console.log("openConnectModal available:", !!openConnectModal)
            if (openConnectModal) {
              try {
                openConnectModal()
              } catch (error) {
                console.error("Error opening connect modal in handleContinue:", error)
                alert("Failed to open wallet connection modal. Please check your browser console for details.")
              }
            } else {
              alert("Please install a wallet extension like MetaMask to continue.")
            }
          }
          break
        default:
          break
      }
    }, 1000)
  }

  const handleBack = () => {
    router.back()
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null
  }

  return (
    <>
      <div className="relative flex min-h-screen flex-col bg-radial-gradient from-[#E3ECFA] to-[#F5F7FE] dark:from-[#000B19] dark:to-[#040405]">
        {/* Fixed Header */}
        <div className="fixed left-0 right-0 top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <Image src="/ultra-pay/logo.png" alt="Logo" width={120} height={78} className=" sm:w-[155px]" />
            <ThemeToggle />
          </div>
        </div>

        {/* Form Container */}
        <div className="flex w-full flex-1 items-center justify-center px-4 py-24 sm:pt-20">
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
              <div className="mb-3 sm:mb-4">
                <button
                  onClick={handleBack}
                  className="mb-2 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span className="text-sm sm:text-base">Back</span>
                </button>

                <h1 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                  Choose Payment Method
                </h1>
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
                      <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Paying</p>
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

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-2 sm:space-y-3"
              >
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className={`relative cursor-pointer rounded-xl border p-3 transition-all sm:p-4 ${
                      selectedMethod === method.id
                        ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                        : method.disabled
                        ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-[#13131b] dark:hover:border-gray-600"
                    }`}
                    onClick={() => handleMethodSelect(method.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div
                          className={`mt-1 rounded-lg p-1.5 sm:p-2 ${
                            method.disabled ? "bg-gray-200 dark:bg-gray-700" : "bg-blue-100 dark:bg-blue-900"
                          }`}
                        >
                          <div className="sm:hidden">{React.cloneElement(method.icon, { className: "h-4 w-4" })}</div>
                          <div className="hidden sm:block">{method.icon}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3
                              className={`text-sm font-medium ${
                                method.disabled ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"
                              } sm:text-base`}
                            >
                              {method.title}
                            </h3>
                            {method.badge && (
                              <span
                                className={`rounded-full px-1.5 py-0.5 text-xs font-medium sm:px-2 sm:py-1 ${method.badgeColor}`}
                              >
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs ${
                              method.disabled ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400"
                            } sm:text-sm`}
                          >
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Chain Selection - Only show when wallet connect is selected */}
              {/* {selectedMethod === "connect-wallet" && !isConnected && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#13131b]"
      >
        <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Select Network</h3>
        <div className="grid grid-cols-3 gap-2">
          {availableChains.map((chain) => (
            <button
              key={`${chain.id}-${chain.type}`}
              onClick={() => setSelectedChain(chain.id)}
              className={`flex flex-col items-center space-y-1 rounded-lg border p-2 text-xs transition-all ${
                selectedChain === chain.id
                  ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-[#13131b] dark:hover:border-gray-600"
              }`}
            >
              {chain.icon}
              <span className="text-gray-900 dark:text-white">{chain.name}</span>
            </button>
          ))}
        </div>
      </motion.div>
    )} */}

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-4 sm:mt-6"
              >
                <ButtonModule
                  variant="primary"
                  size="lg"
                  className="w-full transform py-2.5 font-medium transition-all hover:scale-[1.01] sm:py-3"
                  onClick={handleContinue}
                  loading={loading || isConnecting}
                  disabled={!selectedMethod || isConnecting}
                >
                  {selectedMethod === "connect-wallet" && !isConnected ? "Connect Wallet" : "Continue"}
                </ButtonModule>
              </motion.div>

              {/* Security Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mt-4 flex items-center justify-center sm:mt-6"
              >
                <Shield className="mr-2 h-3 w-3 text-gray-500 dark:text-gray-400 sm:h-4 sm:w-4" />
                <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  All methods are secure. Choose the one that works best for you.
                </p>
              </motion.div>
            </motion.div>
          </motion.main>
        </div>
        <Footer />
        {/* Download App Modal */}
        <DownloadAppModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} />
      </div>
    </>
  )
}

export default function PaymentMethodPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentMethodWrapper />
    </Suspense>
  )
}
