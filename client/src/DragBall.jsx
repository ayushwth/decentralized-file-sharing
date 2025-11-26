"use client"

import { frame, motion, useSpring } from "motion/react"
import { useEffect, useRef } from "react"

export default function Drag() {
    const ref = useRef(null)
    const { x, y } = useFollowPointer(ref)

    return (
        <motion.div
            ref={ref}
            style={{
                ...ball,
                x,
                y
            }}
        />
    )
}

const spring = { damping: 2, stiffness: 200 }

function useFollowPointer(ref) {
    const x = useSpring(0, spring)
    const y = useSpring(0, spring)

    useEffect(() => {
        if (!ref.current) return

        const handlePointerMove = ({ clientX, clientY }) => {
            const element = ref.current

            frame.read(() => {
                x.set(clientX - element.offsetWidth / 2)
                y.set(clientY - element.offsetHeight / 2)
            })
        }

        window.addEventListener("pointermove", handlePointerMove)
        return () => window.removeEventListener("pointermove", handlePointerMove)
    }, [])

    return { x, y }
}

/*** Styles ***/
const ball = {
    zIndex: 50,
    width: 20,
    height: 20,
    backgroundColor: "#a8dbf5ff",
    borderRadius: "50%",
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
}
