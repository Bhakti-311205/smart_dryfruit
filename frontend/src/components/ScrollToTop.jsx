import React, { useState, useEffect } from "react";
import { Fab, Zoom } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Zoom in={visible}>
            <Fab
                onClick={scrollToTop}
                size="medium"
                sx={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    zIndex: 1200,
                    background: "linear-gradient(135deg, #6B3E26, #8BC34A)",
                    color: "white",
                    boxShadow: "0 4px 20px rgba(30,60,114,0.4)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #3E2723, #1a7a94)",
                        transform: "scale(1.1)",
                    },
                    transition: "transform 0.2s ease",
                }}
            >
                <KeyboardArrowUp />
            </Fab>
        </Zoom>
    );
};

export default ScrollToTop;
