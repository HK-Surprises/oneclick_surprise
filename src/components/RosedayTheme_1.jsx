"use client"

import LyricsScreen from "./screens/roseday_2/LyricsScreen"
import Music from "./screens/roseday_2/Music"

import { motion, AnimatePresence } from "framer-motion"
import Screen1 from "./screens/roseday_2/Screen1"
import Screen2 from "./screens/roseday_2/Screen2"
import { useState } from "react"

export default function RosedayTheme_1({name}) {
  const [currentScreen, setCurrentScreen] = useState(1)
  const [musicStarted, setMusicStarted] = useState(false)

  return (
    <div className="min-h-screen bg-black bg-gradient-to-tr from-purple-950/80 via-black to-pink-950/70">

      <AnimatePresence mode="wait">
        {currentScreen === 1 && <Screen1 key="screen1" name={name} onNext={() => setCurrentScreen(2)} />}
        {currentScreen === 2 && <Screen2 key="screen2" onNext={() => {
          setCurrentScreen(3)
          setMusicStarted(true)
        }} />}
        {currentScreen === 3 && <LyricsScreen key="screen3" />}
      </AnimatePresence>

      {musicStarted && <Music shouldPlay={musicStarted} />}

      {/* Watermark */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 1,
        }}
        className="fixed bottom-4 right-4 text-sm text-white/40 pointer-events-none z-50">
        @oneclick_surprise
      </motion.div>
    </div>
  )
}
