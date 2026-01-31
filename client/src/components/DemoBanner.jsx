import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info } from 'lucide-react'

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 relative z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5" />
            <div>
              <span className="font-semibold">🚀 Demo Mode Active!</span>
              <span className="ml-2 opacity-90">
                This is a live demo of LinguaTrade. All features are functional with sample data.
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm opacity-90">
              <span>Try:</span>
              <span className="bg-white/20 px-2 py-1 rounded">demo@linguatrade.com</span>
            </div>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}