import React from 'react'
const Card = ({ card }) => {
    const circleStyle = {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#ccc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    };

    const valueStyle = {
        position: 'absolute',
    };

    const upStyle = {
        ...valueStyle,
        top: '5%',
    };

    const rightStyle = {
        ...valueStyle,
        right: '5%',
        transform: 'translateY(-20%)',
    };

    const downStyle = {
        ...valueStyle,
        bottom: '5%',
    };

    const leftStyle = {
        ...valueStyle,
        left: '5%',
        transform: 'translateY(-20%)',
    };

    return (
        <>    <div>
            <h3>Matricule: #{card.name ? card.name : card.id}</h3>
        </div>
            <div style={circleStyle}>
                <p style={upStyle}>{card.up}</p>
                <p style={rightStyle}>{card.right}</p>
                <p style={downStyle}>{card.down}</p>
                <p style={leftStyle}>{card.left}</p>
            </div>
        </>
    )
}

export default Card