import React from 'react';
import './carrossel.css';

const SectionCarrossel = () => {
  const texto = "CARROSSEL";
  const letras = texto.split('').map((letra, index) => (
    <span
      key={index}
      className={ index % 2 !== 0 ? 'letra-azul' : 'letra-branca' }
    >
      {letra}
    </span>
  ));

  return (
    <h2 className="carrossel-text">{letras}</h2>
  );
};

export default SectionCarrossel;
