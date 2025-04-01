import React, { useState, useEffect } from "react";
import "./fufy.css";

// Função para importar imagens dinamicamente usando Vite
const importImages = async () => {
  const imageModules = import.meta.glob("./fufyimages/*.{png,jpg,jpeg,gif,svg}");
  const imagePromises = Object.keys(imageModules).map(async (path) => {
    const module = await imageModules[path]();
    return module.default;
  });
  return Promise.all(imagePromises);
};

// Função para embaralhar um array (Fisher-Yates Shuffle)
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
  const [positions, setPositions] = useState({
    background: [],
    middle: [],
    foreground: []
  });

  useEffect(() => {
    importImages().then((urls) => {
      const shuffledUrls = shuffleArray(urls);
      setImageUrls(shuffledUrls);
      
      // Gerar as posições iniciais apenas uma vez
      const backgroundPositions = [
        { row: Math.floor(Math.random() * 5) + 1, col: 1 },
        { row: Math.floor(Math.random() * 5) + 1, col: 5 },
        { row: 1, col: Math.floor(Math.random() * 5) + 1 }
      ];
      
      const middlePositions = [
        { row: Math.floor(Math.random() * 3) + 2, col: 2 },
        { row: Math.floor(Math.random() * 3) + 2, col: 4 },
        { row: Math.floor(Math.random() * 3) + 2, col: 2 }
      ];
      
      setPositions({
        background: shuffleArray(backgroundPositions),
        middle: shuffleArray(middlePositions),
        foreground: [{ row: 3, col: 3 }]
      });
    });
  }, []);

  const handleActivate = () => {
    setIsActive(true);
  };

  const handleDeactivate = () => {
    setIsActive(false);
  };

  return (
    <section id="fufy">
      <div 
        className="component3d"
        onMouseEnter={handleActivate}
        onMouseLeave={handleDeactivate}
        onTouchStart={handleActivate}
        onTouchEnd={handleDeactivate}
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