import React from 'react'

const PowerModal = ({ power, isHovered, isGrey, alert }) => {
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
    case "fight5":
      powerText = "Increase 4 attributes of a selected card in your hand by 1 for this round."
      break;
    case "fight6":
      powerText = "Increase 4 attributes of a selected card in your hand by 2 for this round."
      break;
    case "fight7":
      powerText = "Increase 4 attributes of a selected card in your hand by 2 permanently."
      break;
    case "fight8":
      powerText = "Increase 4 attributes of a selected card in your hand by 3 permanently."
      break;
    case "fight9":
      powerText = "Increase 4 attributes of a selected card in your hand by 4 permanently."
      break;
    case "fight10":
      powerText = "Increase 4 attributes of 2 selected cards in your hand by 4 permanently or increase 4 attributes of 1 card in your hand by 5 permanently."
      break;
    case "diplomacy1":
      powerText = "Reduce 1 random attribute of a random card in your opponent's hand by 1 for this round."
      break;
    case "diplomacy2":
      powerText = "Reduce 2 random attributes of a random card in your opponent's hand by 1 for this round."
      break;
    case "diplomacy3":
      powerText = "Reduce 3 random attributes of a random card in your opponent's hand by 1 for this round."
      break;
    case "diplomacy4":
      powerText = "Reduce 4 random attributes of a random card in your opponent's hand by 1 for this round."
      break;
    case "diplomacy5":
      powerText = "Reduce 4 attributes of a selected card on the board or in your opponent's hand by 1 for this round."
      break;
    case "diplomacy6":
      powerText = "Reduce 4 attributes of a selected card on the board or in your opponent's hand by 2 for this round."
      break;
    case "diplomacy7":
      powerText = "Reduce 4 attributes of a selected card on the board or in your opponent's hand by 2 permanently."
      break;
    case "diplomacy8":
      powerText = "Reduce 4 attributes of a selected card on the board or in your opponent's hand by 3 permanently."
      break;
    case "diplomacy9":
      powerText = "Reduce 4 attributes of a selected card on the board or in your opponent's hand by 4 permanently."
      break;
    case "diplomacy10":
      powerText = "Reduce 4 attributes of 2 selected cards on the board or in your opponent's hand by 4 permanently or reduce 4 attributes of 1 card on the board or in your opponent's hand by 5 permanently"
      break;
    case "espionage1":
      powerText = "Reveal 1 random card in your opponent's hand permanently."
      break;
    case "espionage2":
      powerText = "Reveal 1 random card in your opponent's hand permanently and reduce his power by 1 point."
      break;
    case "espionage3":
      powerText = "Reveal 2 random cards in your opponent's hand permanently and reduce his power by 1 point."
      break;
    case "espionage4":
      powerText = "Reveal 2 random cards in your opponent's hand permanently and reduce his power by 2 points."
      break;
    case "espionage5":
      powerText = "Reveal 2 random cards in your opponent's hand permanently and reduce his power by 2 points. (Reveal permanently the opponent's ability)"
      break;
    case "espionage6":
      powerText = "Reveal 3 random cards in your opponent's hand permanently and reduce his power by 3 points. (Reveal permanently the opponent's ability)"
      break;
    case "espionage7":
      powerText = "Reveal 3 random cards in your opponent's hand permanently and reduce his power by 3 points. You can change a card in your hand with one random card in your opponent's hand for this round. (Reveal permanently the opponent's ability)"
      break;
    case "espionage8":
      powerText = "Reveal 4 random cards in your opponent's hand permanently and reduce his power by 4 points. You can change a card in your hand with one random card in your opponent's hand for this round. (Reveal permanently the opponent's ability)"
      break;
    case "espionage9":
      powerText = "Reveal 5 cards in your opponent's hand permanently and reduce his power to 0. You can change a card in your hand with one random card in your opponent's hand for this round. (Reveal permanently the opponent's ability)"
      break;
    case "espionage10":
      powerText = "Reveal 5 cards in your opponent's hand permanently and reduce his power to 0. You can change a card in your hand with a selected card in your opponent's hand for this round."
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
    case "leadership5":
      powerText = "Select 1 opponent's card on the board and swap 4 of its attributes with a random attribute from one of your opponent's cards for this round."
      break;
    case "leadership6":
      powerText = "Select 1 card on the board and swap 4 of its attributes with a random attribute from one of your opponent's cards for this round."
      break;
    case "leadership7":
      powerText = "Select 1 card in your hand or on the board and switch randomly the attributes verticaly or horizontaly for this round."
      break;
    case "leadership8":
      powerText = "Select 1 card in your hand or on the board and switch the attributes verticaly and horizontaly for this round."
      break;
    case "leadership9":
      powerText = "Select 1 card in your hand or on the board and swap the attributes with 1, 2, or 3 turns on the right for this round."
      break;
  }

  return (
    <div style={isHovered ? hoverModalStyle : modalStyle}>
      <h3>{power} {isGrey && `🔒${power[power.length - 1] * 10}`}</h3>
      <p>
        {alert ? (alert) : (powerText)}
      </p>
    </div>
  )
}

export default PowerModal