import React from "react";
import CarouselText from './carrosseltext';
import Carrosselimages from './carrosselimages'
import './carrossel.css';

const Carousel = () => {
    return (
      <section id="carrossel">
        <CarouselText />
        <Carrosselimages />
      </section>
    );
  };
  
export default Carousel;