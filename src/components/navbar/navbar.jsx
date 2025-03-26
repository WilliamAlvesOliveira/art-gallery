import React from 'react';
import NavButton from './navbuttons';
import './navbar.css'
import carouselIcon from './icons/carousel-icon.png';
import bricks from './icons/brick.png';
import swords from './icons/swords.png';
import music from './icons/music.png'



const navItems = [
    { icon: carouselIcon, text: 'Carrossel' },
    { icon: bricks, text: 'Masonry' },
    { icon: swords, text: 'RPG'},
    { icon: music, text: 'Versos'}
];

const NavBar = () => {
    return (
        <nav className="nav-bar">
            {navItems.map((item, index) => (
                <NavButton key={index} icon={item.icon} text={item.text} />
            ))}
        </nav>
    );
};

export default NavBar;