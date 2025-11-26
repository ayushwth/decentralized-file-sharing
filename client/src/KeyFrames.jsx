import * as motion from "motion/react-client";

export default function Keyframes() {
    return (
        <motion.div
            animate={{
                scale: [0.5, 1, 1, 0.5, 0.5],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "0%"],
            }}
            transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1,
            }}
            style={box}
        />
    );
}

const box = {
    position: "fixed",
    left: 1200,
    top: 230,
    width: 100,
    height: 100,
    backgroundColor: "#00e4e4ff",
    borderRadius: 5,
};
