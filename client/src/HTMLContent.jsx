import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

export default function HTMLContent({count:countFromProp}) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));
    console.log(countFromProp)
    useEffect(() => {
        const controls = animate(count, countFromProp, { duration: 2 });
        return () => controls.stop();
    }, [countFromProp]);

    return <motion.pre style={text}>{rounded}</motion.pre>;
}

const text = {
    position: "fixed",
    left:400,
    top:150,
    fontSize: 64,
    color: "#8df0cc",
};
