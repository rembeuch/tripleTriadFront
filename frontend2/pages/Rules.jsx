import React from 'react'
import Layout from '@/components/Layout/Layout'


const Rules = () => {
    return (
        <Layout >
            <div style={{ padding: '20px', margin: '0 auto', maxWidth: '800px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <h1><strong>Battle Rules</strong></h1>
                <p>Each player starts with 5 cards, and 9 cards will be placed on the board at the end of each round.</p>
                <p>If you have 6 or more cards in your possession on the board at the end of the round, you win that round.</p>
                <p>If you have 4 or 5 cards, it's a tie.</p>
                <p>If you have 3 or fewer cards, you lose the round.</p>
                <p>You win the battle when the number of rounds you win equals the number of rounds required for the battle (1 to 5).</p>
                <p>You lose the battle if the number of rounds won by your opponent equals the number of rounds required for the battle.</p>
                <br />
                <h2><strong>Card Mechanics:</strong></h2>
                <p>Each player plays one card per turn on one of the 9 empty spaces.</p>
                <p>Each card has 4 edges. The card that has just been placed can capture adjacent opponent cards if the number on the common side is higher.</p>
                <p>This only applies to the last card played; a newly placed card with a lower number will not be captured by an adjacent card placed in previous turns.</p>
                <br />
                <h2><strong>Special Rules:</strong></h2>
                <p><strong>"Same":</strong> If at least two of the adjacent opponent cards have the same number as the card played on their common side, they are captured. Additionally, if cards with lower numbers than those captured are around them, a combo is triggered, and they are also captured.</p>
                <p><strong>"Plus":</strong> If the sums of the numbers on the common side are identical for at least two of the adjacent opponent cards to the played card, those cards are conquered. The "combo" effect is triggered if one or more neighboring cards of those turned over show lower values. They are then also captured.</p>
                <br />
                <h2><strong>Power:</strong></h2>
                <p>Your power gauge fills up when you capture opponent cards. +1 per card, +3 with a "Same" or "Plus", +5 with a combo.</p>
                <p>Power depends on your ability selected with your Elite card.</p>
                <p>When used well, power can be devastating and turn the tide of a game.</p>
            </div>
        </Layout>

    )
}

export default Rules