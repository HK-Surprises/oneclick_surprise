"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import ScreenContainer from "../ScreenContainer"

export default function LoaderScreen({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete()
        }, 3000)

        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <ScreenContainer>
            <div className="text-center">
                <motion.div
                    className="mb-8"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.div
                        className="text-8xl mb-4 inline-block"
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        💖
                    </motion.div>
                </motion.div>

                <motion.h1
                    className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    Loading something special...
                </motion.h1>

                <motion.div
                    className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 256 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
                    />
                </motion.div>
            </div>
        </ScreenContainer>
    )
}
