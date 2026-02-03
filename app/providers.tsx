// app/providers.tsx
"use client"

import { store } from "lib/redux/store"
import { Provider } from "react-redux"
import { NotificationProvider } from "components/ui/Notification/Notification"
import Modal from "react-modal"
import ThemeProviders from "components/ProvidersComponents/ThemeProviders"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet, polygon, optimism, arbitrum, base, sepolia, linea, bsc, sei } from "wagmi/chains"
import "@rainbow-me/rainbowkit/styles.css"
import { env } from "env.mjs"

// Set the app element for accessibility for all modals
if (typeof window !== "undefined") {
  Modal.setAppElement(document.body)
}

// Check if WalletConnect Project ID is available
const walletConnectProjectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!walletConnectProjectId) {
  console.warn(
    "WalletConnect Project ID is not configured. MetaMask and other injected wallets will still work, but WalletConnect will not be available. To enable WalletConnect, get a project ID from https://cloud.walletconnect.com and set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your environment variables."
  )
}

// RainbowKit configuration
const config = getDefaultConfig({
  appName: "UltraPay",
  projectId: walletConnectProjectId, // Will be undefined if not set, which disables WalletConnect
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia, linea, bsc, sei],
  ssr: true,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Custom themes to match your app
const customDarkTheme = darkTheme({
  accentColor: "#2563eb",
  accentColorForeground: "white",
  borderRadius: "medium",
  fontStack: "system",
  overlayBlur: "small",
})

const customLightTheme = lightTheme({
  accentColor: "#2563eb",
  accentColorForeground: "white",
  borderRadius: "medium",
  fontStack: "system",
  overlayBlur: "small",
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={{
              darkMode: customDarkTheme,
              lightMode: customLightTheme,
            }}
            modalSize="compact"
          >
            <ThemeProviders>
              <NotificationProvider />
              {children}
            </ThemeProviders>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  )
}
