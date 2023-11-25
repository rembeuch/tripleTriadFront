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
  const [elites, setElites] = useState([]);
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [removeAlert, setRemoveAlert] = useState(false);
  const [addAlert, setAddAlert] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(null);




  async function getPlayer() {
    const response = await fetch(`${`http://localhost:3000/api/v1/find?address=${address}`}`);
    return response.json();
  }

  async function getElites() {
    const response = await fetch(`${`http://localhost:3000/api/v1/elites?address=${address}`}`);
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

  async function RecruitElite() {

    const response = await fetch(`${`http://localhost:3000/api/v1/elites?address=${address}`}`,
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
    const fetchCurrentElites = async () => {
      try {
        const json = await getElites();
        console.log(json.length)
        setElites(json);
      } catch (error) {
        console.error("Failed to fetch the player: ", error);
      }
    };
    fetchCurrentElites();
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
  }, [deck.length, addAlert]);

  useEffect(() => {
    setSelectedCardId(selectedCardId)
  }, [addAlert]);

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
      <Layout>
        {isConnected ? (
          <div>
            <h2>{player.name}</h2>
            <p>{player.wallet_address}</p>
            <p>Your Team: {deck.length + elites.length}/5</p>
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
                    <p style={{background: "white", margin: '5px'}}> Elite #{card.name}</p>
                      <Flex>
                        <Card card={card} />
                      </Flex>
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
                    <p style={{background: "white", margin: '5px'}}> Matricule #{card.id}</p>
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
                    <p style={{background: "white", margin: '5px'}}> Matricule #{card.id}</p>
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
