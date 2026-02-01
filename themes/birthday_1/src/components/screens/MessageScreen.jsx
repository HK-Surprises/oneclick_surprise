"use client"

import { useState } from "react"
import Button from "../Button"
import { Gift } from "lucide-react"

export default function MessageScreen({ name, age }) {
    const [opened, setOpened] = useState(false)

    return (
        <div className="bg-[#fff8fc] p-7 rounded-[60px] drop-shadow-2xl min-w-48 w-full max-w-110 relative flex flex-col items-center gap-4 my-10">
            <div
                className="text-center">
                <h2
                    className="text-2xl md:text-3xl font-semibold text-primary text-center"
                >
                    A Special Message
                </h2>

                <p className="text-primary/70 text-sm">
                    Tap to open
                </p>
            </div>

            <div
                onClick={() => setOpened(!opened)}
                className={`card  relative h-71.25 w-full rounded-[40px] overflow-hidden shadow-inner cursor-pointer transition-all bg-linear-to-b from-white/80 to-pink-200 flex items-center justify-center max-w-71.25`}
            >
                <div className={`cover ${opened ? "opacity-0" : "opacity-100"} pointer-events-none z-10 bg-[#ffedea]!`} />

                <div className="relative px-6 h-56 overflow-y-auto text-foreground">
                    Happy Birthday, {name}! You deserve all the happiness, love, and smiles in the world today and always. You have this special way of making everything around you brighter, your smile, your kindness, and the way you make people feel truly cared for. I hope your day is filled with laughter, surprises, and moments that make your heart happy. You’re truly one of a kind, and I just want you to know how special you are. Keep being the amazing person you are, spreading joy wherever you go. Wishing you endless happiness, success, and all the sweet things life has to offer. 💗
                </div>
            </div>
            <div
                className="mt-4">
                <Button
                    onClick={() => {
                        window.location.reload();
                    }}
                    className="bg-[#f1caeb] text-primary"
                >
                    <Gift size={20} />
                    Start the surprise Again
                </Button>
            </div>
        </div>
    )
}
