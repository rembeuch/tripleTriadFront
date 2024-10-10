import React from 'react';

const Card = ({ card, played, reveal }) => {
    const circleStyle = {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundImage: 'url("https://res.cloudinary.com/dsiamykrd/image/upload/v1728113281/compass_b9qu84.webp")',
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        margin: "auto",
        border: '1px solid black', 
        color: 'black',
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
        color: 'black'
    };

    const valueStyle = {
        position: 'absolute',
        backgroundColor: '#fff', // Fond opaque pour les chiffres
        padding: '5px 10px', // Espacement autour des chiffres
        borderRadius: '5px', // Coins arrondis pour un meilleur look
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
            {reveal ? (
                <div style={circleStyle}>
                    <p style={upStyle}>?</p>
                    <p style={rightStyle}>?</p>
                    <p style={downStyle}>?</p>
                    <p style={leftStyle}>?</p>
                </div>
            ) : (
                <>
                    <div style={played ? tyleStyle : circleStyle}>
                        {played && (
                            <>
                                <p style={upStyle}>{card.up}</p>
                                <p style={rightStyle}>{card.right}</p>
                                <p style={downStyle}>{card.down}</p>
                                <p style={leftStyle}>{card.left}</p>
                            </>
                        )}
                        {!card.computer && (
                            <>
                                <p style={upStyle}>{card.up}</p>
                                <p style={rightStyle}>{card.right}</p>
                                <p style={downStyle}>{card.down}</p>
                                <p style={leftStyle}>{card.left}</p>
                            </>
                        )}
                        {!card.hide && (
                            <>
                                <p style={upStyle}>{card.up}</p>
                                <p style={rightStyle}>{card.right}</p>
                                <p style={downStyle}>{card.down}</p>
                                <p style={leftStyle}>{card.left}</p>
                            </>
                        )}
                        {card.hide && card.computer && !played && (
                            <>
                                <p style={upStyle}>?</p>
                                <p style={rightStyle}>?</p>
                                <p style={downStyle}>?</p>
                                <p style={leftStyle}>?</p>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default Card;
