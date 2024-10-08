// pages/player/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useProvider, useSigner } from 'wagmi'
import { Text, Box, Button } from '@chakra-ui/react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Image,
} from '@chakra-ui/react'
import Layout from '@/components/Layout/Layout';
import CosmosBackground from '@/components/CosmosBackground';
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
  const [removeAlert, setRemoveAlert] = useState("");
  const [addAlert, setAddAlert] = useState("");
  const [removeCardAlert, setRemoveCardAlert] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [pnj, setPnj] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const dialogues = [
    'Voici ton état actuel, en cliquant sur Détails tu peux aller booster tes capacités et changer de pouvoir',
    'ici tu peux ajouter des monstres'
  ]

  const handleNext = () => {
    if (currentPage < dialogues.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  async function getPlayer() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_player?token=${authToken}`}`);
    return response.json();
  }

  async function getPnj() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_pnj?player_id=${player.id}`}`);
    return response.json();
  }

  async function getElites() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/elites?player_id=${player.id}`}`);
    return response.json();
  }

  async function getDeck() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/deck?id=${player.id}`}`);
    return response.json();
  }

  async function getCards() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cards?player_id=${player.id}`}`);
    return response.json();
  }

  async function rankCards(sort) {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rank_cards?player_id=${player.id}&sort=${sort}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      setCards(responseData)
    }
  }

  // async function RecruitElite() {

  //   const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/elites?player_id=${player.id}`}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   if (response.ok) {
  //     const responseData = await response.json();
  //     setElites(responseData)
  //   }
  // }


  async function addCard(id) {

    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/add_card?id=${player.id}&card_id=${id}`}`,
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

    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/remove_card?id=${player.id}&card_id=${id}`}`,
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
        setRemoveCardAlert(responseData.message);
        setSelectedCardId(responseData.id);
        setTimeout(() => {
          setRemoveCardAlert("")
        }, 3000);
      }
    }
  }

  const wallet = async () => {
    try {
      await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/connect_wallet?token=${authToken}`}`);
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
    if (!authToken) return;
    fetchCurrentPlayer();
  }, [authToken]);

  useEffect(() => {
    if (!player) return;
    const fetchCurrentPnj = async () => {
      try {
        const json = await getPnj();
        setPnj(json);
      } catch (error) {
        console.error("Failed to fetch the player: ", error);
      }
    };
    fetchCurrentPnj();
  }, [player]);

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
  }, [removeCardAlert, addAlert, player]);

  useEffect(() => {
    setSelectedCardId(selectedCardId)
  }, [addAlert, removeCardAlert]);

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

  const cardStyle = (card) => ({
    border: '1px solid #ddd',
    padding: '50px',
    borderRadius: '8px',
    textAlign: 'center',
    backgroundImage: `
    linear-gradient(to right, rgba(218,165,32, 0.7), rgba(139,69,19, 0.7))`,
    backgroundSize: 'cover', // Ajuste la taille de l'image pour couvrir le conteneur
    backgroundPosition: 'center', // Centre l'image
    color: 'black',
  });

  const eliteCardStyle = {
    border: '1px solid #ddd',
    padding: '50px',
    borderRadius: '8px',
    textAlign: 'center',
    color: 'black',
    backgroundImage: `
    linear-gradient(to right, rgba(218,165,32, 0.7), rgba(139,69,19, 0.7))`,
  };

  if (!player) return <h2>Loading...</h2>;
  if (!deck) return <h2>Loading...</h2>;


  return (
    <>
      <CosmosBackground>
        <Layout pvp={pvp}>
          {player ? (
            <div>
              <div>
                <h2>{player.name}</h2>
                <p>Your Team: {deck.length + elites.length}/5</p>

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
                  <h2>
                    <p>Cardinum ⚡: {player.energy}</p>
                    <p>ability: {player.ability}</p>
                    <p>Diamonds 💎: {player.elite_points}</p>
                    <Link href="/Stats">
                      <button style={{
                        color: "#F9DC5C",
                        backgroundColor: "blue",
                        padding: "10px 50px",
                        margin: 10,
                        transition: "background-color 0.3s ease",
                        borderRadius: 5,
                        textDecoration: "none"
                      }} > Stats </button>
                    </Link>
                  </h2>
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
                      {pnj && pnj.try === 0 && currentPage === 0 &&
                        <Box
                          bg="rgba(50, 50, 50, 0.9)"
                          borderRadius="20px"
                          boxShadow="0 4px 8px rgba(0, 0, 0, 0.5)"
                          padding="20px"
                          margin="20px"
                          maxWidth="600px"
                          height="200px"
                          width="300px"
                          display="flex"
                          flexDirection="column"
                          justifyContent="space-between"
                          position="relative" // Pour positionner correctement le triangle
                          _after={{
                            content: '""',
                            position: "absolute",
                            top: "50%", // Position verticale (centrée par rapport à la hauteur)
                            left: "-10px", // Positionné à gauche de la bulle
                            transform: "translateY(-50%)", // Centré verticalement
                            borderTop: "10px solid transparent",
                            borderBottom: "10px solid transparent",
                            borderRight: "10px solid rgba(50, 50, 50, 0.9)", // Couleur du triangle correspondant à la bulle
                          }}
                        >
                          {/* Texte du dialogue actuel avec gestion du défilement si texte trop long */}
                          <Text
                            color="white"
                            textAlign="center"
                            marginBottom="20px"
                            overflowY="auto" // Ajoute un défilement si le texte dépasse
                          >
                            {dialogues[currentPage]}
                          </Text>

                          {/* Conteneur pour les boutons de navigation */}
                          <Box display="flex" justifyContent="center" alignItems="center">
                            {/* Bouton droit pour la pagination */}
                            <Button
                              onClick={handleNext}
                              disabled={currentPage === dialogues.length - 1}
                              marginLeft="10px"
                              bg="gray.700" // Bouton gris foncé
                              color="white" // Texte blanc sur bouton
                              _hover={{ bg: "gray.600" }} // Changement de couleur au hover
                              _disabled={{ bg: "gray.500", cursor: "not-allowed" }} // Désactivation avec couleur plus claire
                            >
                              ▶
                            </Button>
                          </Box>
                        </Box>
                      }
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
                {deck.length >= 1 && deck.map(card => (
                  <div key={card.id} style={cardStyle(card)} className="card">
                    <Image
                      src={card.image || 'https://t4.ftcdn.net/jpg/01/68/49/67/240_F_168496711_iFQUk2vqAnnDpVzGm2mtp8u2gqgwZrY7.jpg'}
                      alt={card.name}
                      borderRadius="8px"
                      boxSize="200px" // Taille de l'image
                      objectFit="cover"
                    />
                    <p style={{ background: "white", margin: '5px' }}> {card.name}</p>
                    <Flex>
                      <Card card={card} />
                    </Flex>
                    {removeCardAlert && selectedCardId == card.id &&
                      <div>
                        <Alert status='warning' width="50%">
                          <AlertIcon />
                          {removeCardAlert}
                        </Alert>
                      </div>
                    }
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
              <p>Spirits: {player.monsters.length} / sort by: <button onClick={() => rankCards("rank")}>rank</button> / <button onClick={() => rankCards("up")}>up</button> / <button onClick={() => rankCards("right")}>right</button> / <button onClick={() => rankCards("down")}>down</button> / <button onClick={() => rankCards("left")}>left</button>  / <button onClick={() => rankCards("copy")}>points</button> / <button onClick={() => rankCards("max")}>max</button> / <button onClick={() => rankCards("somme")}>no filter</button>  </p>

              <div style={gridContainerStyle}>
                {cards.map(card => (
                  <div key={card.id} style={cardStyle(card)} className="card">
                    <Image
                      src={card.image || 'https://t4.ftcdn.net/jpg/01/68/49/67/240_F_168496711_iFQUk2vqAnnDpVzGm2mtp8u2gqgwZrY7.jpg'}
                      alt={card.name}
                      borderRadius="8px"
                      boxSize="200px" // Taille de l'image
                      objectFit="cover"
                    />
                    <p style={{ background: "white", margin: '5px' }}> {card.name} rank:{card.rank} 👾:{card.copy}</p>
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
                    {!card.max &&
                      <button onClick={() => addCard(card.id)} style={{
                        color: "#F9DC5C",
                        backgroundColor: "blue",
                        padding: "10px 10px",
                        marginTop: 10,
                        transition: "background-color 0.3s ease",
                        borderRadius: 5,
                        textDecoration: "none",
                        boxShadow: currentPage === 1 && deck.length < 1
                          ? "0 0 30px 10px rgba(255, 215, 0, 0.9)"
                          : "none",
                        opacity: currentPage === 1 && deck.length < 1 ? 1 : 0.8,

                      }} > Add
                      </button>
                    }
                  </div>
                ))}
                {currentPage === 1 && deck.length < 1 &&
                  <Box
                    bg="rgba(50, 50, 50, 0.9)"
                    borderRadius="20px"
                    boxShadow="0 4px 8px rgba(0, 0, 0, 0.5)"
                    padding="20px"
                    margin="20px"
                    maxWidth="600px"
                    height="200px"
                    width="300px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    position="relative" // Pour positionner correctement le triangle
                    _after={{
                      content: '""',
                      position: "absolute",
                      top: "50%", // Position verticale (centrée par rapport à la hauteur)
                      left: "-10px", // Positionné à gauche de la bulle
                      transform: "translateY(-50%)", // Centré verticalement
                      borderTop: "10px solid transparent",
                      borderBottom: "10px solid transparent",
                      borderRight: "10px solid rgba(50, 50, 50, 0.9)", // Couleur du triangle correspondant à la bulle
                    }}
                  >
                    {/* Texte du dialogue actuel avec gestion du défilement si texte trop long */}
                    <Text
                      color="white"
                      textAlign="center"
                      marginBottom="20px"
                      overflowY="auto" // Ajoute un défilement si le texte dépasse
                    >
                      {dialogues[currentPage]}
                    </Text>

                    {/* Conteneur pour les boutons de navigation */}
                    <Box display="flex" justifyContent="center" alignItems="center">
                      {/* Bouton droit pour la pagination */}
                      <Button
                        onClick={handleNext}
                        disabled={currentPage === dialogues.length - 1}
                        marginLeft="10px"
                        bg="gray.700" // Bouton gris foncé
                        color="white" // Texte blanc sur bouton
                        _hover={{ bg: "gray.600" }} // Changement de couleur au hover
                        _disabled={{ bg: "gray.500", cursor: "not-allowed" }} // Désactivation avec couleur plus claire
                      >
                        ▶
                      </Button>
                    </Box>
                  </Box>
                }
              </div>
            </div>
          )
            : (<Alert status='warning' width="50%">
              <AlertIcon />
              Please, login or create account
            </Alert>)}
        </Layout>
      </CosmosBackground>
    </>

  );
}

export default Player;
