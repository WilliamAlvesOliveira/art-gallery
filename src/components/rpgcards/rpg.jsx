import React, { useState, useEffect } from 'react';
import './rpg.css';
import Characters from './characters.json';

const importAllImages = async () => {
    const images = import.meta.glob("./rpgimages/*.{png,jpg,jpeg}");

    const imageList = await Promise.all(
        Object.entries(images).map(async ([path, importer]) => {
            const module = await importer();
            return {
                src: module.default,
                alt: path.split("/").pop().replace(/\.(png|jpg|jpeg)$/, ""),
            };
        })
    );

    // Cria um mapa para facilitar acesso às imagens
    const imageMap = {};
    imageList.forEach(image => {
        imageMap[image.alt] = image.src;
    });
    return imageMap;
};

const RPG = () => {
    const [images, setImages] = useState({});
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            const loadedImages = await importAllImages();
            setImages(loadedImages); // Define o estado com as imagens carregadas
        };

        fetchImages();
    }, []);

    const selectedCharacter = selectedCard
        ? Characters.find(character => character.name === selectedCard)
        : null;

    const currentBackground = selectedCharacter
        ? images[`${selectedCharacter.name.toLowerCase()}back`]
        : images["defaultbackground"];

    return (
        <section id="RPG">
            <h2>RPG Cards</h2>
            <div
                id="poster"
                style={{
                    backgroundImage: `url(${currentBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {selectedCharacter && (
                    <div className="character-info">
                        <h3>{selectedCharacter.titulo}</h3>
                        <p>{selectedCharacter.text}</p>
                    </div>
                )}
            </div>

            <div id="cards">
                {Characters.map((character, index) => {
                    const frontImage = images[`${character.name.toLowerCase()}front`];

                    return (
                        <div
                            key={index}
                            className="card"
                            onClick={() => setSelectedCard(character.name)}
                        >
                            <h3>{character.titulo}</h3>
                            <img
                                src={frontImage}
                                alt={`Card de ${character.titulo}`}
                            />
                            <p>{character.text}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default RPG;