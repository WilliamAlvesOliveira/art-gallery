import React, { useState, useEffect } from "react";
import "./rockers.css";

const rockersData = [
    { id: "drums", name: "Drummer", color: "radial-gradient(#416183, #3C6683)" },
    { id: "guitar1", name: "Lead Guitarist", color: "radial-gradient(#7F83A9, #868BB4)" },
    { id: "vocals", name: "Vocalist", color: "radial-gradient(#282947, #282945)" },
    { id: "guitar2", name: "Rhythm Guitarist", color: "radial-gradient(#6B489C, #6E489E)" },
    { id: "bass", name: "Bassist", color: "radial-gradient(#8C83AE, #8B83B2)" }
];

const importAllImages = async () => {
    const images = import.meta.glob("./rockersimagaes/*.{png,jpg,jpeg}");
    const imageList = await Promise.all(
        Object.entries(images).map(async ([path, importer]) => {
            const module = await importer();
            return {
                src: module.default,
                name: path.split("/").pop().replace(/\.(png|jpg|jpeg)$/, ""),
            };
        })
    );
    return imageList;
};

function criarHarmonico(audioContext) {
    const oscillator = audioContext.createOscillator();       // Geração de som
    const gainNode = audioContext.createGain();               // Volume
    const distortion = audioContext.createWaveShaper();       // Distorção

    // Criação de harmônicos misturando ondas
    oscillator.type = "square";                               // Som mais agressivo
    oscillator.frequency.setValueAtTime(1320, audioContext.currentTime); // Frequência alta

    // Controle do volume com decaimento rápido
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

    // Função para criar curva de distorção (simples mas eficaz)
    function makeDistortionCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
            const x = i * 2 / n_samples - 1;
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }

    distortion.curve = makeDistortionCurve(400); // Mais curva = mais sujo/agressivo
    distortion.oversample = '4x';

    // Encadeando os nós de áudio
    oscillator.connect(distortion);
    distortion.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Toca por 1 segundo
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
}

const Rockers = () => {
    const [images, setImages] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [lastTouched, setLastTouched] = useState(null);
    const audioContextRef = React.useRef(null);

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const fetchImages = async () => {
            const imgList = await importAllImages();
            console.log("Imagens carregadas:", imgList);
            setImages(imgList);
        };
        fetchImages();
    }, []);

    // Evento de Teclado para Navegação
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (focusedIndex === null) return;

            if (event.key === "ArrowRight") {
                setFocusedIndex((prev) => (prev + 1) % rockersData.length);
            } else if (event.key === "ArrowLeft") {
                setFocusedIndex((prev) => (prev - 1 + rockersData.length) % rockersData.length);
            } else if (event.key === "Enter") {
                blinkEffect(focusedIndex, audioContextRef.current);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [focusedIndex]);

    // Função para piscar o elemento e disparar o harmônico
    const blinkEffect = (index, audioContext) => {
        const element = document.getElementById(rockersData[index].id);
        if (!element) return;

        const originalBg = element.style.backgroundImage;
        let isWhite = false;

        const interval = setInterval(() => {
            element.style.backgroundImage = isWhite ? originalBg : "none";
            element.style.backgroundColor = isWhite ? "transparent" : "white";
            isWhite = !isWhite;
        }, 200);

        setTimeout(() => {
            clearInterval(interval);
            element.style.backgroundImage = originalBg;
            element.style.backgroundColor = "transparent";
        }, 1000);

        criarHarmonico(audioContext); // Dispara o som do harmônico
    };

    return (
        <section id="playerSelect">
            <div className="rocker-container">
                <h1>Select Your Rocker</h1>
                <div className="rockers">
                    {rockersData.map((rocker, index) => {
                        const image = images.find(img => img.name === rocker.id);
                        return (
                            <div
                                key={rocker.id}
                                id={rocker.id}
                                className={`rocker ${focusedIndex === index ? "focus" : ""}`}
                                style={{ backgroundImage: rocker.color }}
                                onMouseEnter={() => setFocusedIndex(index)}
                                onClick={() => {
                                    if (focusedIndex === index) blinkEffect(index, audioContextRef.current);
                                    else setFocusedIndex(index);
                                }}
                                onTouchStart={() => {
                                    if (lastTouched === index) {
                                        blinkEffect(index, audioContextRef.current);
                                        setLastTouched(null);
                                    } else {
                                        setFocusedIndex(index);
                                        setLastTouched(index);
                                    }
                                }}
                            >
                                {image && <img src={image.src} alt={rocker.name} />}
                                <h2>{rocker.name}</h2>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Rockers;