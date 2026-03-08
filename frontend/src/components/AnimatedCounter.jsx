import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@mui/material";

const AnimatedCounter = ({ value, duration = 1500, prefix = "", suffix = "", sx = {} }) => {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;

        const numericValue = parseInt(String(value).replace(/\D/g, ""), 10) || 0;
        const step = Math.max(1, Math.ceil(numericValue / (duration / 30)));
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= numericValue) {
                setCount(numericValue);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, 30);

        return () => clearInterval(timer);
    }, [started, value, duration]);

    const displayValue = started ? `${prefix}${count}${suffix}` : `${prefix}0${suffix}`;

    return (
        <Typography ref={ref} sx={sx}>
            {displayValue}
        </Typography>
    );
};

export default AnimatedCounter;
