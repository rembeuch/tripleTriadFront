// pages/player/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
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
import { useAuth } from '@/contexts/authContext';

function Player() {
  const { authToken } = useAuth();
  const { address, isConnected } = useAccount()
  const router = useRouter();
  const { id } = router.query;
  const [player, setPlayer] = useState(null);
  const [pvp, setPvp] = useState(null);
  const [elites, setElites] = useState([]);
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [removeAlert, setRemoveAlert] = useState(false);
  const [addAlert, setAddAlert] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(null);




  async function getPlayer() {
    const response = await fetch(`${`http://localhost:3000/api/v1/find?token=${authToken}`}`);
    return response.json();
  }

  async function getElites() {
    const response = await fetch(`${`http://localhost:3000/api/v1/elites?token=${authToken}`}`);
    return response.json();
  }

  async function getDeck() {
    const response = await fetch(`${`http://localhost:3000/api/v1/deck?token=${authToken}`}`);
    return response.json();
  }

  async function getCards() {
    const response = await fetch(`${`http://localhost:3000/api/v1/cards?token=${authToken}`}`);
    return response.json();
  }

  async function RecruitElite() {

    const response = await fetch(`${`http://localhost:3000/api/v1/elites?token=${authToken}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      setElites(responseData)
    }
  }

  
  async function addCard(id) {

    const response = await fetch(`${`http://localhost:3000/api/v1/add_card?token=${authToken}&card_id=${id}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
      );
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.message == "") {
          setDeck(responseData)
      }

      if (responseData.message != "") {
        setAddAlert(responseData.message);
        setSelectedCardId(responseData.id);
        setTimeout(() => {
          setAddAlert("")
        }, 3000);
      }
    }
  }

  async function removeCard(id) {

    const response = await fetch(`${`http://localhost:3000/api/v1/remove_card?token=${authToken}&card_id=${id}`}`,
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

  const wallet = async () => {
    try {
      await fetch(`${`http://localhost:3000/api/v1/connect_wallet?token=${authToken}`}`);
    }
    catch (e) {
      console.log(e.reason)
    }
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
  }, [address, authToken]);

  useEffect(() => {
    const fetchCurrentElites = async () => {
      try {
        const json = await getElites();
        setElites(json);
      } catch (error) {
        setElites(null);
        console.error("Failed to fetch the player: ", error);
      }
    };
    if (isConnected || player) {
      fetchCurrentElites();
    }
  }, [address, authToken, isConnected, player]);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const json = await getDeck();
        setDeck(json);
      } catch (error) {
        console.error("Failed to fetch the player: ", error);
      }
    };
    if (player) {
      fetchDeck();
    }
  }, [deck.length, addAlert, player]);

  useEffect(() => {
    setSelectedCardId(selectedCardId)
  }, [addAlert]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const json = await getCards();
        setCards(json);
      } catch (error) {
        console.error("Failed to fetch the player: ", error);
      }
    };
    if (player) {
      fetchCards();
    }
  }, [player]);

  useEffect(() => {
    if (player) {
      setPvp(player.in_pvp);
    }
  }, [player]);
  
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
    backgroundImage: 'url(" https://t4.ftcdn.net/jpg/01/68/49/67/240_F_168496711_iFQUk2vqAnnDpVzGm2mtp8u2gqgwZrY7.jpg")',


  };

  const eliteCardStyle = {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    backgroundImage: 'url(" https://t4.ftcdn.net/jpg/01/68/49/67/240_F_168496711_iFQUk2vqAnnDpVzGm2mtp8u2gqgwZrY7.jpg")',
  };

  if (!player) return <h2>Loading...</h2>;
  if (!deck) return <h2>Loading...</h2>;


  return (
    <>
      <Layout pvp={pvp}>
        {isConnected || player ? (
          <div>
            <div>
              <h2>{player.name}</h2>
              <p>ability: {player.ability}</p>
              <p>Your Team: {deck.length + elites.length}/5</p>
              <p>Elite points: {player.elite_points}</p>
            </div>
            {removeAlert && <div>
              <Alert status='warning' width="50%">
                <AlertIcon />
                You can't, you are in game!
              </Alert>
            </div>
            }

            <hr></hr>
            {elites.length > 0 ? (
              <div style={gridContainerStyle}>
                <h2> Your Elites:</h2>
                {elites.map(card => (
                  <>
                    <div key={card.id} style={eliteCardStyle} className="card">
                      <p style={{ background: "white", margin: '5px' }}> {card.name}
                        {card.nft && '//NFT'}
                      </p>
                      <Flex>
                        <Card card={card} />
                      </Flex>
                      <Link href="/elite/[id]" as={`/elite/${card.id}`}>
                        <button style={{
                          color: "#F9DC5C",
                          backgroundColor: "green",
                          padding: "10px 50px",
                          margin: 10,
                          transition: "background-color 0.3s ease",
                          borderRadius: 5,
                          textDecoration: "none"
                        }} > Details </button>
                      </Link>
                    </div>
                  </>
                ))}
              </div >
            ) :
              (
                <div>
                  <button onClick={() => RecruitElite()} style={{
                    color: "#F9DC5C",
                    backgroundColor: "blue",
                    padding: "10px 10px",
                    marginTop: 10,
                    transition: "background-color 0.3s ease",
                    borderRadius: 5,
                    textDecoration: "none"
                  }} > Recruit Elite
                  </button>
                </div>
              )

            }
            <hr></hr>
            <div style={gridContainerStyle}>
              {deck.map(card => (
                <div key={card.id} style={cardStyle} className="card">
                  <p style={{ background: "white", margin: '5px' }}> {card.name}</p>
                  <Flex>
                    <Card card={card} />
                  </Flex>
                  <button onClick={() => removeCard(card.id)} style={{
                    color: "#F9DC5C",
                    backgroundColor: "red",
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
                  <p style={{ background: "white", margin: '5px' }}> {card.name} points:{card.copy}</p>
                  <Flex>
                    <Card card={card} />
                  </Flex>
                  {addAlert && selectedCardId == card.id && <div>
                    <Alert status='warning' width="50%">
                      <AlertIcon />
                      {addAlert}
                    </Alert>
                  </div>
                  }
                  <Link href="/monster/[id]" as={`/monster/${card.id}`}>
                    <button style={{
                      color: "#F9DC5C",
                      backgroundColor: "green",
                      padding: "10px 50px",
                      margin: 5,
                      transition: "background-color 0.3s ease",
                      borderRadius: 5,
                      textDecoration: "none"
                    }} > Details </button>
                  </Link>
                  <button onClick={() => addCard(card.id)} style={{
                    color: "#F9DC5C",
                    backgroundColor: "blue",
                    padding: "10px 10px",
                    marginTop: 10,
                    transition: "background-color 0.3s ease",
                    borderRadius: 5,
                    textDecoration: "none"
                  }} > Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
          : (<Alert status='warning' width="50%">
            <AlertIcon />
            Please, login or create account
          </Alert>)}
      </Layout>
    </>

  );
}

export default Player;
