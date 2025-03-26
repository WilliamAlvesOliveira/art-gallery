import React from 'react';

const NavButton = ({ icon, text }) => {
    return (
        <div className="nav-button">
            <img src={icon} alt={text} className="nav-icon" />
            <span className="nav-text">{text}</span>
        </div>
    );
};

export default NavButton;