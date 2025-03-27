import React, { useState, useEffect, useRef } from "react";
import emotionData from "./music.json";
import "./music.css";

const importAllImages = async () => {
  const images = import.meta.glob("./versesimages/*.{png,jpg,jpeg}");

  const imageList = await Promise.all(
    Object.entries(images).map(async ([path, importer]) => {
      const module = await importer();
      return {
        src: module.default,
        alt: path.split("/").pop().replace(/\.(png|jpg|jpeg)$/, ""),
      };
    })
  );

  const imageMap = {};
  imageList.forEach(({ src, alt }) => {
    imageMap[alt.toLowerCase()] = src;
  });

  return imageMap;
};

const useOnScreen = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return isVisible;
};

const getRandomPosition = (lastPosition) => {
  const positions = ["flex-start", "center", "flex-end"];
  let newPosition;
  do {
    newPosition = positions[Math.floor(Math.random() * positions.length)];
  } while (newPosition === lastPosition);
  return newPosition;
};

const MusicCard = ({ emotion, text, song, autor, position, images }) => {
  const ref = useRef();
  const isVisible = useOnScreen(ref);
  const bgImage = images[emotion.toLowerCase()];

  return (
    <div
      ref={ref}
      className={`musiccard ${isVisible ? "visible" : "hidden"}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        alignSelf: position,
      }}
    >
      {isVisible && (
        <>
          <div className="poetry">
            {text.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <div className="song-info">
            <p>
              <span className="song">{song}</span>
              <br />
              <span className="songAuthor">- {autor}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const MusicGallery = () => {
  const [positions, setPositions] = useState([]);
  const [images, setImages] = useState(null);

  useEffect(() => {
    let lastPosition = "";
    setPositions(
      emotionData.map(() => {
        lastPosition = getRandomPosition(lastPosition);
        return lastPosition;
      })
    );
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const imageMap = await importAllImages();
      setImages(imageMap);
    };

    loadImages();
  }, []);

  if (!images) {
    return <div>Loading...</div>;
  }

  return (
    <section id="music-cards">
      {emotionData.map((item, index) => (
        <MusicCard
          key={index}
          emotion={item.emotion}
          text={item.text}
          song={item.song}
          autor={item.autor}
          position={positions[index]}
          images={images}
        />
      ))}
    </section>
  );
};

export default MusicGallery;