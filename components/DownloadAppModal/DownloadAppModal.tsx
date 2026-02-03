"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import AppleIcon from "public/Icons/Apple"
import GooglePlayIcon from "public/Icons/GooglePlay"

interface DownloadAppModalProps {
  isOpen: boolean
  onClose: () => void
}

const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  // Smart URL that redirects based on platform
  const smartDownloadUrl = "https://qr-code-sand-seven.vercel.app/"

  // Direct URLs for the buttons
  const appStoreUrl = "https://apps.apple.com/ng/app/ultra-app/id6450269232"
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.ahmadhabib.ultraappfrontend"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 sm:right-6 sm:top-6 sm:size-8"
        >
          ×
        </button>

        <div className="mb-4 text-center sm:mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Download Ultra App</h2>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Scan the QR code to download our app
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          {/* QR Code */}
          <div className="flex items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 sm:p-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex size-32 items-center justify-center sm:size-48">
                <Image
                  src="/qr-code.png"
                  alt="QR Code for Ultra App Download"
                  width={128}
                  height={128}
                  className="size-full object-contain sm:h-[192px] sm:w-[192px]"
                  onError={(e) => {
                    // Fallback if QR code image doesn't exist
                    const target = e.target as HTMLElement
                    target.innerHTML = `
                      <div class="flex size-full items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                        <div class="text-center">
                          <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:text-sm">QR Code</div>
                          <div class="text-xs text-gray-400 dark:text-gray-500">Scan with your phone</div>
                        </div>
                      </div>
                    `
                  }}
                />
              </div>
              <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Scan with your phone camera to download</p>

              {/* Direct App Link */}
              <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Or open directly if app is installed:</p>
                <a
                  href={smartDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Open Ultra App
                </a>
              </div>
            </div>
          </div>

          <div className="flex gap-3 max-sm:w-full max-sm:flex-col sm:gap-4">
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-black px-3 py-2.5 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 max-sm:w-full max-sm:justify-center sm:gap-3 sm:px-4 sm:py-3"
            >
              <div className="flex-shrink-0">
                <AppleIcon />
              </div>
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </a>

            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-black px-3 py-2.5 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 max-sm:w-full max-sm:justify-center sm:gap-3 sm:px-4 sm:py-3"
            >
              <div className="flex-shrink-0">
                <GooglePlayIcon />
              </div>
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </a>
          </div>

          <div className="px-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Available on iOS and Android devices</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              The QR code will automatically detect your device
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DownloadAppModal
