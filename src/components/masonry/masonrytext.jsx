import React, { useState, useEffect, useRef } from "react";
import "./masonry.css"; // Arquivo de estilos

const Wall = ({ rows = 4, cols = 8 }) => {
    const [wallRows, setWallRows] = useState([]);
    const [animate, setAnimate] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const wallRef = useRef(null);

    useEffect(() => {
        let newWall = [];
        let delay = 0;
        let maxDelay = 0;

        for (let row = 0; row < rows; row++) {
            let blocks = [];
            for (let col = 0; col < cols; col++) {
                blocks.push({ id: row * cols + col, delay });
                maxDelay = Math.max(maxDelay, delay);
                delay += 0.1; // Atraso na animação
            }
            newWall.push({ blocks, isOddRow: row % 2 !== 0 });
        }

        setWallRows(newWall);
    }, [rows, cols]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    startAnimation();
                }
            },
            { threshold: 0.8 }
        );

        if (wallRef.current) observer.observe(wallRef.current);

        return () => observer.disconnect();
    }, []);

    const startAnimation = () => {
        setAnimate(false);
        setShowTitle(false);
        
        setTimeout(() => {
            setAnimate(true);
            const totalAnimationTime = (rows * cols * 0.1 + 0.5) * 1000;
            setTimeout(() => setShowTitle(true), totalAnimationTime);
        }, 100);
    };

    return (
        <div className="wall-wrapper">
            <div ref={wallRef} className="wall-container" onClick={startAnimation}>
                {showTitle && <h2 className="masonry fade-in">Masonry Layout</h2>}
                {wallRows.map((row, rowIndex) => (
                    <div key={rowIndex} className={`wall-row ${row.isOddRow ? "row-odd" : ""}`}>
                        {row.blocks.map((block) => (
                            <div 
                                key={block.id} 
                                className={`block ${animate ? "animate" : ""}`} 
                                style={{ animationDelay: `${block.delay}s` }}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wall;
