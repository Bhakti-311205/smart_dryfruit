import React from "react";

// Predefined positions so they don't recalculate on every render (which breaks MUI keyframes)
const BLOBS = [
    { size: 200, top: "10%", left: "5%", color: "rgba(139,195,74,0.25)", duration: 18, delay: 0, shape: "30% 70% 70% 30% / 30% 30% 70% 70%" },
    { size: 280, top: "60%", left: "80%", color: "rgba(107,62,38,0.2)", duration: 22, delay: -6, shape: "50%" },
    { size: 160, top: "30%", left: "50%", color: "rgba(215,165,120,0.3)", duration: 16, delay: -3, shape: "50%" },
    { size: 320, top: "75%", left: "20%", color: "rgba(139,195,74,0.2)", duration: 28, delay: -9, shape: "30% 70% 70% 30% / 30% 30% 70% 70%" },
    { size: 180, top: "5%", left: "70%", color: "rgba(215,165,120,0.25)", duration: 20, delay: -4, shape: "50%" },
    { size: 240, top: "45%", left: "10%", color: "rgba(107,62,38,0.18)", duration: 25, delay: -8, shape: "30% 70% 70% 30% / 30% 30% 70% 70%" },
    { size: 140, top: "85%", left: "60%", color: "rgba(139,195,74,0.22)", duration: 19, delay: -2, shape: "50%" },
    { size: 260, top: "20%", left: "35%", color: "rgba(215,165,120,0.28)", duration: 24, delay: -7, shape: "30% 70% 70% 30% / 30% 30% 70% 70%" },
];

const BackgroundAnimation = () => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: -1,
                overflow: "hidden",
            }}
        >
            <style>{`
        @keyframes blob-float-0 { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-110vh) rotate(360deg);opacity:0} }
        @keyframes blob-float-1 { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-110vh) rotate(-360deg);opacity:0} }
        @keyframes blob-float-2 { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-110vh) rotate(260deg);opacity:0} }
        @keyframes blob-float-3 { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-110vh) rotate(-260deg);opacity:0} }
        @keyframes blob-float-4 { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-110vh) rotate(180deg);opacity:0} }
        @keyframes blob-float-5 { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-110vh) rotate(-180deg);opacity:0} }
        @keyframes blob-float-6 { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-110vh) rotate(300deg);opacity:0} }
        @keyframes blob-float-7 { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-110vh) rotate(-300deg);opacity:0} }
      `}</style>

            {BLOBS.map((blob, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        width: blob.size,
                        height: blob.size,
                        background: blob.color,
                        borderRadius: blob.shape,
                        top: blob.top,
                        left: blob.left,
                        filter: "blur(40px)",
                        animation: `blob-float-${i} ${blob.duration}s linear infinite`,
                        animationDelay: `${blob.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default BackgroundAnimation;
