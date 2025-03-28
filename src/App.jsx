import React from 'react';
import './App.css';
import NavBar from './components/navbar/navbar';
import Carrossel from './components/carrossel/carrosel'
import MasonryGsllery from './components/masonry/masonry'
import RPG from './components/rpgcards/rpg'
import Parallax from './components/prallax/parallax';
import Music from './components/music-verses/music'

function App() {
  return (
    <div className="App">
      <NavBar />
      <main>
        <section id="sobre">
            <p>O projeto ART Gallery é uma iniciativa voltada para o desenvolvimento de uma página web interativa utilizando a biblioteca React. O objetivo principal é criar uma experiência visual envolvente e dinâmica, incorporando diversas técnicas modernas de exibição de imagens.</p>
        </section>
        <Carrossel />
        <MasonryGsllery />
        <RPG />
        <Parallax />
        <Music />
      </main>
    </div>
  );
}

export default App;
