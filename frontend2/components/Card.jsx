import React from 'react'
const Card = ({ card, played }) => {

    const circleStyle = {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: '#ccc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        margin: "auto",
    };

    const tyleStyle = {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        backgroundColor: '#ccc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        margin: "auto",
        marginTop: '30px',
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
        <>
            <div style={played ? tyleStyle : circleStyle}>
                <p style={upStyle}>{card.up}</p>
                <p style={rightStyle}>{card.right}</p>
                <p style={downStyle}>{card.down}</p>
                <p style={leftStyle}>{card.left}</p>
            </div>
        </>
    )
}

export default Card