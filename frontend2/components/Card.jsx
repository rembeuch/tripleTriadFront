import React from 'react'
const Card = ({ card, played, reveal }) => {

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
                        {played &&
                            <>
                                <p style={upStyle}>{card.up}</p>
                                <p style={rightStyle}>{card.right}</p>
                                <p style={downStyle}>{card.down}</p>
                                <p style={leftStyle}>{card.left}</p>
                            </>
                        }
                        {!card.computer &&
                            <>
                                <p style={upStyle}>{card.up}</p>
                                <p style={rightStyle}>{card.right}</p>
                                <p style={downStyle}>{card.down}</p>
                                <p style={leftStyle}>{card.left}</p>
                            </>
                        }
                        {!card.hide &&
                            <>
                                <p style={upStyle}>{card.up}</p>
                                <p style={rightStyle}>{card.right}</p>
                                <p style={downStyle}>{card.down}</p>
                                <p style={leftStyle}>{card.left}</p>
                            </>
                        }
                        {card.hide && card.computer && !played &&
                            <>
                                <p style={upStyle}>?</p>
                                <p style={rightStyle}>?</p>
                                <p style={downStyle}>?</p>
                                <p style={leftStyle}>?</p>
                            </>
                        }
                    </div>
                </>
            )}

        </>
    )
}

export default Card