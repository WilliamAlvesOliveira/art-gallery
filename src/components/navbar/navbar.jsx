import React from 'react';
import NavButton from './navbuttons';
import './navbar.css';
import carouselIcon from './icons/carousel-icon.png';
import bricks from './icons/brick.png';
import swords from './icons/swords.png';
import music from './icons/music.png';
import castle from './icons/castle.png';
import guitar from './icons/electric-guitar.png';

const navItems = [
    { icon: carouselIcon, text: 'Carrossel', target: 'carrossel' },
    { icon: bricks, text: 'Masonry', target: 'brasil' },
    { icon: swords, text: 'RPG', target: 'RPG' },
    { icon: music, text: 'Versos', target: 'music-cards' },
    { icon: guitar, text: 'Rockers', target: 'playerSelect'},
    { icon: castle, text: '3D', target: 'fufy'}
];


const scrollToSection = (targetId) => {
    const section = document.getElementById(targetId);
    const navBarHeight = document.querySelector('.nav-bar').offsetHeight;
    
    if (section) {
        window.scrollTo({
            top: section.offsetTop - navBarHeight,
            behavior: 'smooth'
        });
    }
};

const NavBar = () => {
    const handleClick = (event) => {
        const button = event.target;
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 300);
    };

    return (
        <nav className="nav-bar">
            <button className='nav-arrow' onClick={handleClick}>➯</button>
            <div className='btn-container'>
                {navItems.map((item, index) => (
                    <NavButton key={index} icon={item.icon} text={item.text} onClick={() => scrollToSection(item.target)} />
                ))}      
            </div>
            <button className='nav-arrow' onClick={handleClick}>➯</button>
        </nav>
    );
};

export default NavBar;
