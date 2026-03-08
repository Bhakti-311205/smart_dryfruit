import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const AnimatedValue = ({ value, duration = 1200 }) => {
  const [displayValue, setDisplayValue] = useState(value);
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

    // Extract numeric part
    const strValue = String(value);
    const numericMatch = strValue.match(/(\d+)/);
    if (!numericMatch) {
      setDisplayValue(strValue);
      return;
    }

    const target = parseInt(numericMatch[1], 10);
    const prefix = strValue.slice(0, numericMatch.index);
    const suffix = strValue.slice(numericMatch.index + numericMatch[0].length);
    const step = Math.max(1, Math.ceil(target / (duration / 30)));
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplayValue(strValue);
        clearInterval(timer);
      } else {
        setDisplayValue(`${prefix}${current}${suffix}`);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [started, value, duration]);

  return <span ref={ref}>{started ? displayValue : String(value).replace(/\d+/, "0")}</span>;
};

const StatCard = ({ label, value, subtext }) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: 3,
      bgcolor: "rgba(234, 219, 200, 0.9)",
      backdropFilter: "blur(6px)",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: 6,
      },
    }}
  >
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
        <AnimatedValue value={value} />
      </Typography>
      {subtext && (
        <Box mt={1}>
          <Typography variant="caption" color="success.main">
            {subtext}
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default StatCard;
