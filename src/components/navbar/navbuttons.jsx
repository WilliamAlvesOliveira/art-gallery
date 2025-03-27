import React from 'react';

const NavButton = ({ icon, text, onClick }) => {
    return (
        <div className="nav-button" onClick={onClick} style={{ cursor: 'pointer' }}>
            <img src={icon} alt={text} className="nav-icon" />
            <span className="nav-text">{text}</span>
        </div>
    );
};

export default NavButton;
