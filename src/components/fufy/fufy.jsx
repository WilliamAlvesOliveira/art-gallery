import React, { useState, useEffect, useRef } from "react";
import "./fufy.css";

const importImages = async () => {
  const imageModules = import.meta.glob("./fufyimages/*.{png,jpg,jpeg,gif,svg}");
  const imagePromises = Object.keys(imageModules).map(async (path) => {
    const module = await imageModules[path]();
    return module.default;
  });
  return Promise.all(imagePromises);
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Fufy = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [positions] = useState({
    background: shuffleArray([
      { row: Math.floor(Math.random() * 5) + 1, col: 1 },
      { row: Math.floor(Math.random() * 5) + 1, col: 5 },
      { row: 1, col: Math.floor(Math.random() * 5) + 1 }
    ]),
    middle: shuffleArray([
      { row: Math.floor(Math.random() * 3) + 2, col: 2 },
      { row: Math.floor(Math.random() * 3) + 2, col: 4 },
      { row: Math.floor(Math.random() * 3) + 2, col: 2 }
    ]),
    foreground: [{ row: 3, col: 3 }]
  });

  const containerRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    importImages().then((urls) => {
      setImageUrls(shuffleArray(urls));
    });
  }, []);

  const handleActivate = () => setIsActive(true);
  const handleDeactivate = () => {
    setIsActive(false);
    setRotation({ x: 0, y: 0 }); // Reseta a rotação quando sai
  };

  const handleMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calcula a posição relativa ao centro
    const relX = x - centerX;
    const relY = y - centerY;
    
    // Calcula a rotação baseada na posição do mouse (ajuste os valores para mudar a intensidade)
    const rotateY = (relX / centerX) * 20; // 20 é a intensidade máxima de rotação
    const rotateX = (relY / centerY) * -20; // Invertido para movimento natural
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0]);
    }
  };

  return (
    <section id="fufy">
      <div 
        ref={containerRef}
        className="component3d"
        onMouseEnter={handleActivate}
        onMouseLeave={handleDeactivate}
        onMouseMove={handleMove}
        onTouchStart={handleActivate}
        onTouchEnd={handleDeactivate}
        onTouchMove={handleTouchMove}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isActive ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
        }}
      >
        {imageUrls.slice(0, 7).map((url, index) => {
          let position, layerClass;
          
          if (index < 3) {
            position = positions.background[index];
            layerClass = "layer background";
          } else if (index < 6) {
            position = positions.middle[index - 3];
            layerClass = "layer middle";
          } else {
            position = positions.foreground[0];
            layerClass = "layer foreground";
          }

          return (
            <img
              key={index}
              src={url}
              alt={`Imagem ${index}`}
              className={`${layerClass} ${isActive ? "active" : ""}`}
              style={{
                gridRow: position.row,
                gridColumn: position.col,
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Fufy;