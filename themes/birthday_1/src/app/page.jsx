"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import LoaderScreen from "@/components/screens/LoaderScreen"
import IntroScreen from "@/components/screens/IntroScreen"
import CakeScreen from "@/components/screens/CakeScreen"
import PhotosScreen from "@/components/screens/PhotosScreen"
import MessageScreen from "@/components/screens/MessageScreen"

export default function HomePage({ name, age, photos = [], song: initialSong }) {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [song, setSong] = useState(initialSong || "birthday1")
  const audioRef = useRef(null)

  const SONG_MAP = {
    birthday1: "/songs/Birthday_1/birthday1.mp3",
    birthday2: "/songs/Birthday_1/birthday2.mp3",
    birthday3: "/songs/Birthday_1/birthday3.mp3",
    birthday4: "/songs/Birthday_1/birthday4.mp3",
    birthday5: "/songs/Birthday_1/birthday5.mp3",
  }

  useEffect(() => {
    if (currentScreen >= 1 && audioRef.current) {
      audioRef.current.play().catch(() => {
        // ignore autoplay block
      })
    }
  }, [currentScreen])

  const screens = [
    <LoaderScreen
      key="loader"
      onDone={() => setCurrentScreen(1)}
    />,
    <IntroScreen
      key="intro"
      onNext={() => setCurrentScreen(2)}
      name={name}
      age={age}
    />,
    <CakeScreen
      key="cake"
      onNext={() => setCurrentScreen(3)}
      name={name}
    />,
    <PhotosScreen
      key="photos"
      photos={photos}
      onNext={() => setCurrentScreen(4)}
    />,
    <MessageScreen
      key="message"
      name={name}
      age={age}
    />,
  ];

  return (
    <main className="min-h-screen overflow-hidden relative">

      {/* 🎵 AUDIO PLAYER */}
      {SONG_MAP[song] && (
        <audio ref={audioRef} src={SONG_MAP[song]} loop preload="auto" />
      )}

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center w-full"
          >
            {screens[currentScreen]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Watermark */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 1,
        }}
        className="fixed bottom-4 right-4 text-sm text-black/40 pointer-events-none z-50 font-light">
        @oneclick_surprise
      </motion.div>
    </main>
  )
}
