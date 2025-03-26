import React, { useState, useEffect, useCallback } from "react";
import Masonry from "react-masonry-css";
import "./masonry.css";
import Title from "./masonrytext";

// Função assíncrona para importar todas as imagens da pasta "masonryimages"
const importAllImages = async () => {
  const images = import.meta.glob("./masonryimages/*.{png,jpg,jpeg}");

  const imageList = await Promise.all(
    Object.entries(images).map(async ([path, importer]) => {
      const module = await importer();
      return {
        src: module.default, // Obtém a URL da imagem corretamente
        alt: path.split("/").pop().replace(/\.(png|jpg|jpeg)$/, ""), // Nome da imagem sem extensão
      };
    })
  );

  return imageList;
};

const MasonryGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const breakpointColumns = {
    default: 4,
    768: 3,
    480: 2,
  };

  const openImage = (image) => setSelectedImage(image);
  const closeModal = () => setSelectedImage(null);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") closeModal();
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Carregar imagens ao montar o componente
  useEffect(() => {
    importAllImages().then(setImages);
  }, []);

  return (
    <section id="brasil">
      <Title />
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-container"
        columnClassName="masonry-column"
      >
        {images.map((image, index) => (
          <div className="masonry-item" key={index}>
            <img
              src={image.src}
              alt={image.alt}
              onClick={() => openImage(image)}
              className="clickable-img"
            />
          </div>
        ))}
      </Masonry>

      {selectedImage && (
        <div className="modal" onClick={closeModal} role="dialog" aria-modal="true">
          <button className="close" onClick={closeModal} aria-label="Fechar">
            &times;
          </button>
          <img className="modal-content" src={selectedImage.src} alt={selectedImage.alt} />
        </div>
      )}
    </section>
  );
};

export default MasonryGallery;
