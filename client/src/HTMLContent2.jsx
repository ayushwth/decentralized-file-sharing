"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function HTMLContent2({ trigger = false }) {

    const length = 5; // number of letters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Initialize letters array
    const [letters, setLetters] = useState(
        Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)])
    );

    useEffect(() => {
        if (trigger) return; // stop random letters when triggered

        // Independent intervals for each letter, slower & smooth
        const intervals = letters.map((_, idx) =>
            setInterval(() => {
                setLetters(prev => {
                    const newLetters = [...prev];
                    newLetters[idx] = chars[Math.floor(Math.random() * chars.length)];
                    return newLetters;
                });
            }, 400 + Math.random() * 300)
        );

        return () => intervals.forEach(clearInterval); // cleanup
    }, [trigger]);

    // Final display value
    const displayText = trigger ? "FILES" : letters.join("");


    return (
        <motion.pre
            style={textStyle}
            key={displayText}  
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
        >
            {displayText}
        </motion.pre>
    );
}

const textStyle = {
    position: "fixed",
    left: 200,
    top: 150,
    fontSize: 64,
    color: "#8df0cc",
    fontFamily: "monospace"
};
