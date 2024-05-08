import React from 'react'

const PowerModal = ({ power, isHovered }) => {
  const modalStyle = {
    display: 'none',
  };

  const hoverModalStyle = {
    display: 'block',
    position: 'absolute',
    top: '-250%',
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
      powerText = "Increase a random attribute of a random card in your hand by 1 for this round."
      break;
    case "fight2":
      powerText = "Increase two random attributes of a random card in your hand by 1 for this round."
      break;
    case "diplomacy1":
      powerText = "Reduce a random attribute of a random card in your opponent's hand by 1 for this round."
      break;
    case "diplomacy2":
      powerText = "Reduce two random attribute of a random card in your opponent's hand by 1 for this round."
      break;
    case "espionage1":
      powerText = "Reveal one random card in your opponent's hand permanently."
      break;
    case "espionage2":
      powerText = "Reveal one random card in your opponent's hand permanently and reduce his power by 1 point."
      break;
    case "leadership1":
      powerText = "Choose one random card on the board and swap one of its attributes with a random attribute from one of your opponent's cards for this round."
      break;
    case "leadership2":
      powerText = "Choose one random card on the board and swap 2 of its attributes with a random attribute from one of your opponent's cards for this round."
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