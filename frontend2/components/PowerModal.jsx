import React from 'react'

const PowerModal = ({power, isHovered}) => {
    const modalStyle = {
        display: 'none',
    };

    const hoverModalStyle = {
        display: 'block',
        position: 'relative',
        top: '0',
        right: '0',
        backgroundColor: 'grey',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
        borderRadius: '5px',
        zIndex: '1',
    };

  return (
    <div style={isHovered ? hoverModalStyle : modalStyle}>
        <h3>{power}</h3>
    </div>
  )
}

export default PowerModal