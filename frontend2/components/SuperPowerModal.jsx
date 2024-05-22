import React from 'react'

const SuperPowerModal = ({ power, isHovered, superPower, superPowerCard, changeSuperPowerCards, cancelSuperPowerCards }) => {
    const modalStyle = {
        display: 'none',
    };

    const hoverModalStyle = {
        display: 'block',
        position: 'absolute',
        top: '-275%',
        right: '-100px',
        backgroundColor: 'purple',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
        borderRadius: '5px',
        zIndex: '1',
        cursor: 'default'
    };

    let powerText;
    let buttonText;
    let cardSide;


    switch (power) {
        case "fight1":
            powerText = "Increase 1 random attribute of a random card in your hand by 1 for this round."
            buttonText = "Use Power"
            break;
        case "fight2":
            powerText = "Increase 2 random attributes of a random card in your hand by 1 for this round."
            buttonText = "Use Power"
            break;
        case "fight3":
            powerText = "Increase 3 random attributes of a random card in your hand by 1 for this round."
            buttonText = "Use Power"
            break;
        case "fight4":
            powerText = "Increase 4 attributes of a random card in your hand by 1 for this round."
            buttonText = "Use Power"
            break;
        case "fight5":
            powerText = "Increase 4 attributes of a selected card in your hand by 1 for this round."
            buttonText = "Select Card"
            cardSide = "left"
            break;
        case "fight6":
            powerText = "Increase 4 attributes of a selected card in your hand by 2 for this round."
            buttonText = "Select Card"
            cardSide = "left"
            break;
        case "fight7":
            powerText = "Increase 4 attributes of a selected card in your hand by 2 permanently."
            buttonText = "Select Card"
            cardSide = "left"
            break;
        case "diplomacy1":
            powerText = "Reduce 1 random attribute of a random card in your opponent's hand by 1 for this round."
            buttonText = "Use Power"
            break;
        case "diplomacy2":
            powerText = "Reduce 2 random attributes of a random card in your opponent's hand by 1 for this round."
            buttonText = "Use Power"
            break;
        case "diplomacy3":
            powerText = "Reduce 3 random attributes of a random card in your opponent's hand by 1 for this round."
            buttonText = "Use Power"
            break;
        case "diplomacy4":
            powerText = "Reduce 4 attributes of a random card in your opponent's hand by 1 for this round."
            buttonText = "Use Power"
            break;
        case "diplomacy5":
            powerText = "Reduce 4 attributes of a selected card on the board or in your opponent's hand by 1 for this round."
            buttonText = "Select Card"
            cardSide = "board right"
            break;
        case "diplomacy6":
            powerText = "Reduce 4 attributes of a selected card on the board or in your opponent's hand by 2 for this round."
            buttonText = "Select Card"
            cardSide = "board right"
            break;
        case "diplomacy7":
            powerText = "Reduce 4 attributes of a selected card on the board or in your opponent's hand by 2 permanently."
            buttonText = "Select Card"
            cardSide = "board right"
            break;
        case "espionage1":
            powerText = "Reveal 1 random card in your opponent's hand permanently."
            buttonText = "Use Power"
            break;
        case "espionage2":
            powerText = "Reveal 1 random card in your opponent's hand permanently and reduce his power by 1 point."
            buttonText = "Use Power"
            break;
        case "espionage3":
            powerText = "Reveal 2 random cards in your opponent's hand permanently and reduce his power by 1 point."
            buttonText = "Use Power"
            break;
        case "espionage4":
            powerText = "Reveal 2 random cards in your opponent's hand permanently and reduce his power by 2 points."
            buttonText = "Use Power"
            break;
        case "espionage5":
            powerText = "Reveal 2 random cards in your opponent's hand permanently and reduce his power by 2 points."
            buttonText = "Use Power"
            break;
        case "espionage6":
            powerText = "Reveal 3 random cards in your opponent's hand permanently and reduce his power by 3 points."
            buttonText = "Use Power"
            break;
        case "leadership1":
            powerText = "1 random card on the board swap 1 of its attributes with a random attribute from one of your opponent's cards for this round."
            buttonText = "Use Power"
            break;
        case "leadership2":
            powerText = "1 random card on the board swap 2 of its attributes with a random attribute from one of your opponent's cards for this round."
            buttonText = "Use Power"
            break;
        case "leadership3":
            powerText = "1 random card on the board swap 3 of its attributes with a random attribute from one of your opponent's cards for this round."
            buttonText = "Use Power"
            break;
        case "leadership4":
            powerText = "1 random card on the board swap 4 of its attributes with a random attribute from one of your opponent's cards for this round."
            buttonText = "Use Power"
            break;
        case "leadership5":
            powerText = "Select 1 opponent's card on the board and swap 4 of its attributes with a random attribute from one of your opponent's cards for this round."
            buttonText = "Select Card"
            cardSide = "board"
            break;
        case "leadership6":
            powerText = "Select 1 card on the board and swap 4 of its attributes with a random attribute from one of your opponent's cards for this round."
            buttonText = "Select Card"
            cardSide = "board"
            break;
    }

    return (
        <>
            {isHovered &&
                <>
                    <div style={isHovered ? hoverModalStyle : modalStyle}>
                        {powerText}
                        {buttonText != "Use Power" &&
                            <button onClick={() => changeSuperPowerCards(cardSide)} style={{
                                color: "#F9DC5C",
                                backgroundColor: "blue",
                                padding: "10px 50px",
                                margin: 10,
                                transition: "background-color 0.3s ease",
                                borderRadius: 5,
                                textDecoration: "none"
                            }} > {buttonText} </button>}

                        {buttonText == "Use Power" && superPowerCard == null &&
                            <button onClick={superPower} style={{
                                color: "#F9DC5C",
                                backgroundColor: "blue",
                                padding: "10px 50px",
                                margin: 10,
                                transition: "background-color 0.3s ease",
                                borderRadius: 5,
                                textDecoration: "none"
                            }} > {buttonText} </button>}
                    </div>
                </>
            }
            {superPowerCard != null &&
                <>
                    <div style={hoverModalStyle}>
                        <button onClick={cancelSuperPowerCards} > Cancel X </button>
                        {typeof superPowerCard === 'string' ?
                            (<button onClick={changeSuperPowerCards(cardSide)} style={{
                                color: "#F9DC5C",
                                backgroundColor: "blue",
                                padding: "10px 50px",
                                margin: 10,
                                transition: "background-color 0.3s ease",
                                borderRadius: 5,
                                textDecoration: "none"
                            }} > Select Card </button>)
                            :
                            (
                                <button onClick={superPower} style={{
                                    color: "#F9DC5C",
                                    backgroundColor: "green",
                                    padding: "10px 50px",
                                    margin: 10,
                                    transition: "background-color 0.3s ease",
                                    borderRadius: 5,
                                    textDecoration: "none"
                                }} > Use Power on {superPowerCard.position == "9" && superPowerCard.computer ? "hide#" : superPowerCard.name} </button>
                            )
                        }
                    </div>
                </>
            }
        </>
    )
}

export default SuperPowerModal