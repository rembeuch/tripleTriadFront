// pages/player/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useAccount, useProvider, useSigner } from 'wagmi'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
} from '@chakra-ui/react'
import Layout from '@/components/Layout/Layout';
import Card from '@/components/Card';


function Player() {
  const { address, isConnected } = useAccount()
  const router = useRouter();
  const { id } = router.query;
  const [player, setPlayer] = useState(null);
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [removeAlert, setRemoveAlert] = useState(false);
  const [addAlert, setAddAlert] = useState(false);




  async function getPlayer() {
    const response = await fetch(`${`http://localhost:3000/api/v1/find?address=${address}`}`);
    return response.json();
  }

  async function getDeck() {
    const response = await fetch(`${`http://localhost:3000/api/v1/deck?address=${address}`}`);
    return response.json();
  }

  async function getCards() {
    const response = await fetch(`${`http://localhost:3000/api/v1/cards`}`);
    return response.json();
  }

  useEffect(() => {
    const fetchCurrentPlayer = async () => {
      try {
        const json = await getPlayer();
        setPlayer(json);
      } catch (error) {
        console.error("Failed to fetch the player: ", error);
      }
    };
    fetchCurrentPlayer();
  }, []);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const json = await getDeck();
        setDeck(json);
      } catch (error) {
        console.error("Failed to fetch the player: ", error);
      }
    };
    fetchDeck();
  }, [deck.length]);

  useEffect(() => {
    const fetchCurrentPlayer = async () => {
      try {
        const json = await getCards();
        setCards(json);
      } catch (error) {
        console.error("Failed to fetch the player: ", error);
      }
    };
    fetchCurrentPlayer();
  }, []);

  async function addCard(id) {

    const response = await fetch(`${`http://localhost:3000/api/v1/add_card?address=${address}&card_id=${id}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      setDeck(responseData)
    } else {
      setAddAlert(true);
      setTimeout(() => {
        setAddAlert(false)
      }, 3000);
    }
  }

  async function removeCard(id) {

    const response = await fetch(`${`http://localhost:3000/api/v1/remove_card?address=${address}&card_id=${id}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      setDeck(responseData)
    } else {
      setRemoveAlert(true);
      setTimeout(() => {
        setRemoveAlert(false)
      }, 3000);
    }
  }


  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px',
    margin: '20px',
  };

  const cardStyle = {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  };

  if (!player) return <h2>Loading...</h2>;

  return (
    <>
      <Layout>
        {isConnected ? (
          <div>
            <h2>{player.name}</h2>
            <p>{player.wallet_address}</p>
            <p>Your Team: {deck.length}/5</p>
            {removeAlert && <div>
              <Alert status='warning' width="50%">
                <AlertIcon />
                You can't, you are in game!
              </Alert>
            </div>
            }
            <div style={gridContainerStyle}>
              {deck.map(card => (
                <div key={card.id} style={cardStyle} className="card">
                  Matricule #{card.id}:
                  <Flex>
                    <Card card={card} />
                  </Flex>
                  <button onClick={() => removeCard(card.id)} style={{
                    color: "#F9DC5C",
                    backgroundColor: "blue",
                    padding: "10px 10px",
                    marginTop: 10,
                    transition: "background-color 0.3s ease",
                    borderRadius: 5,
                    textDecoration: "none"
                  }} > Remove from your Team
                  </button>
                </div>
              ))}
            </div>
            <hr></hr>
            <div style={gridContainerStyle}>
              {cards.map(card => (
                <div key={card.id} style={cardStyle} className="card">
                  Matricule #{card.id}:
                  <Flex>
                    <Card card={card} />
                  </Flex>
                  {addAlert && <div>
                    <Alert status='warning' width="50%">
                      <AlertIcon />
                      Team Full!
                    </Alert>
                  </div>
                  }
                  <button onClick={() => addCard(card.id)} style={{
                    color: "#F9DC5C",
                    backgroundColor: "green",
                    padding: "10px 10px",
                    marginTop: 10,
                    transition: "background-color 0.3s ease",
                    borderRadius: 5,
                    textDecoration: "none"
                  }} > Add to your Team
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
          : (<Alert status='warning' width="50%">
            <AlertIcon />
            Please, connect your Wallet!
          </Alert>)}
      </Layout>
    </>

  );
}

export default Player;
