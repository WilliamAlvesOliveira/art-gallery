import React, { useState, useEffect, useMemo, useRef } from 'react';
import dragon from './carrosselimages/skate-dragon.jpg';
import girafa from './carrosselimages/surfgirafa.jpg';
import unicorn from './carrosselimages/unicorn.jpg';
import tiger from './carrosselimages/tiger.jpg'
import './carrossel.css';

const ImageCarousel = () => {
    const images = useMemo(() => [dragon, girafa, unicorn, tiger], []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 3000);
        }
        
        return () => clearInterval(intervalRef.current);
    }, [isPaused, currentIndex]);

    return (
        <div className='carousel-container'>
            <div className='carousel-display'>
                <button className="iconleft" onClick={prevSlide}>◀</button>
                <div className='carousel-slice'
                 onMouseEnter={() => {
                    console.log("Mouse entrou, pausando...");
                    setIsPaused(true);
                }}
                onMouseLeave={() => {
                    console.log("Mouse saiu, retomando...");
                    setIsPaused(false);
                }}>
                    <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="carousel-image" />
                </div>
                <button className="iconright" onClick={nextSlide}>▶</button>
            </div>
            <div className="indicators">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;