import React from 'react'

const PowerModal = ({ power, isHovered }) => {
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
    opacity: "0.9"
  };

  let powerText;
  switch (power) {
    case "fight1":
      powerText = "Increase 1 random attribute of a random card in your hand by 1 for this round."
      break;
    case "fight2":
      powerText = "Increase 2 random attributes of a random card in your hand by 1 for this round."
      break;
    case "fight3":
      powerText = "Increase 3 random attributes of a random card in your hand by 1 for this round."
      break;
    case "fight4":
      powerText = "Increase 4 random attributes of a random card in your hand by 1 for this round."
      break;
    case "diplomacy1":
      powerText = "Reduce 1 random attribute of a random card in your opponent's hand by 1 for this round."
      break;
    case "diplomacy2":
      powerText = "Reduce 2 random attribute of a random card in your opponent's hand by 1 for this round."
      break;
    case "diplomacy3":
      powerText = "Reduce 3 random attribute of a random card in your opponent's hand by 1 for this round."
      break;
    case "diplomacy4":
      powerText = "Reduce 4 random attribute of a random card in your opponent's hand by 1 for this round."
      break;
    case "espionage1":
      powerText = "Reveal 1 random card in your opponent's hand permanently."
      break;
    case "espionage2":
      powerText = "Reveal 1 random card in your opponent's hand permanently and reduce his power by 1 point."
      break;
    case "espionage3":
      powerText = "Reveal 2 random card in your opponent's hand permanently and reduce his power by 1 point."
      break;
    case "espionage4":
      powerText = "Reveal 2 random card in your opponent's hand permanently and reduce his power by 2 point."
      break;
    case "leadership1":
      powerText = "1 random card on the board swap 1 of its attributes with a random attribute from one of your opponent's cards for this round."
      break;
    case "leadership2":
      powerText = "1 random card on the board swap 2 of its attributes with a random attribute from one of your opponent's cards for this round."
      break;
    case "leadership3":
      powerText = "1 random card on the board swap 3 of its attributes with a random attribute from one of your opponent's cards for this round."
      break;
    case "leadership4":
      powerText = "1 random card on the board swap 4 of its attributes with a random attribute from one of your opponent's cards for this round."
      break;
  }

  return (
    <div style={isHovered ? hoverModalStyle : modalStyle}>
      <h3>{power}</h3>
      <p>
        {powerText}
      </p>
    </div>
  )
}

export default PowerModal