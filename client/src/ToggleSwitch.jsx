"use client"

import { motion, Transition } from "motion/react"
import { useState } from "react"

export default function ToggleSwitch() {
    const [isOn, setIsOn] = useState(true)

    return (
        <div className="toggle-container">
            <div
                className="toggle-switch"
                data-is-on={isOn}
                onClick={() => setIsOn(!isOn)}
            >
                <motion.div
                    className="toggle-ball"
                    layout
                    transition={isOn ? spring : bounce}
                />
            </div>
        </div>
    )
}

/* ================= Constants ================= */

const bounce = {
    duration: 1.2,
    ease: bounceEase,
}

const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
}

/* ================= Utils ================= */

// From https://easings.net/#easeOutBounce
function bounceEase(x) {
    const n1 = 7.5625
    const d1 = 2.75

    if (x < 1 / d1) {
        return n1 * x * x
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375
    }
}
