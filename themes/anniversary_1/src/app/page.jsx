"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

import LoaderScreen from "@/components/screens/LoaderScreen"
import IntroScreen from "@/components/screens/IntroScreen"
import AnniversaryScreen from "@/components/screens/AnniversaryScreen"
import PhotoGalleryScreen from "@/components/screens/PhotoGalleryScreen"
import MessageScreen from "@/components/screens/MessageScreen"

export default function AnniversaryApp(props) {
  const [currentScreen, setCurrentScreen] = useState("loader")
  const audioRef = useRef(null)

  // payload props
  const {
    couple_name,
    partner_name,
    photos = [],
    message,
    months_together,
    song
  } = props

  const SONG_MAP = {
    anniversary1: "/songs/Anniversary_1/anniversary1.mp3",
    anniversary2: "/songs/Anniversary_1/anniversary2.mp3",
    anniversary3: "/songs/Anniversary_1/anniversary3.mp3",
  }

  const goToIntro = () => setCurrentScreen("intro")
  const goToAnniversary = () => setCurrentScreen("anniversary")
  const goToGallery = () => setCurrentScreen("gallery")
  const goToMessage = () => setCurrentScreen("message")

  // 🎵 PLAY MUSIC AFTER LOADER
  useEffect(() => {
    if (currentScreen !== "loader" && audioRef.current) {
      audioRef.current.play().catch(() => {
        // autoplay blocked – user gesture needed
      })
    }
  }, [currentScreen])
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-black to-purple-950 overflow-hidden">

      {/* 🎵 AUDIO PLAYER */}
      {SONG_MAP[song] && (
        <audio
          ref={audioRef}
          src={SONG_MAP[song]}
          loop
          preload="auto"
        />
      )}

      <AnimatePresence mode="wait">
        {currentScreen === "loader" && (
          <LoaderScreen key="loader" onComplete={goToIntro} />
        )}

        {currentScreen === "intro" && (
          <IntroScreen
            key="intro"
            couple_name={couple_name}
            onNext={goToAnniversary}
          />
        )}

        {currentScreen === "anniversary" && (
          <AnniversaryScreen
            key="anniversary"
            partner_name={partner_name}
            months_together={months_together}
            onNext={goToGallery}
          />
        )}

        {currentScreen === "gallery" && (
          <PhotoGalleryScreen
            key="gallery"
            photos={photos}
            onNext={goToMessage}
          />
        )}

        {currentScreen === "message" && (
          <MessageScreen
            key="message"
            message={message}
          />
        )}
      </AnimatePresence>

      {/* Watermark */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed bottom-4 right-4 text-[13px] text-white/40 pointer-events-none z-50 font-light"
      >
        @oneclick_surprise
      </motion.div>
    </div>
  )
}
