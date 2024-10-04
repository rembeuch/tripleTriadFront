import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { Text, Box, Button } from '@chakra-ui/react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import Auth from './Auth'
import { useAuth } from '@/contexts/authContext';
import CosmosBackground from '@/components/CosmosBackground'



export default function Home() {
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [pvp, setPvp] = useState(null);
  const [game, setGame] = useState(null);
  const [deck, setDeck] = useState([]);
  const [elites, setElites] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { authToken } = useAuth();
  const { address, isConnected } = useAccount()
  const [notFound, setNotFound] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dialogues, setDialogues] = useState([])
  const [currentPage, setCurrentPage] = useState(0);

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

  async function getDialogues() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/display_menu_dialogue?player_id=${player.id}`}`);
    return response.json();
  }

  async function getGame() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_game?id=${player.id}`}`);
    return response.json();
  }

  async function getPvp() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_pvp?token=${authToken}`}`);
    return response.json();
  }

  async function getDeck() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/deck?id=${player.id}`}`);
    return response.json();
  }

  async function resendConfirmationEmail(email) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player: { email }
      }),
    });
    return response.json();
  }

  const handleResend = async () => {
    try {
      const response = await resendConfirmationEmail(email);
      if (response.success) {
        setMessage('Confirmation email resent successfully.');
      } else {
        setError('Error resending the confirmation email.');
      }
    } catch (error) {
      setError('Failed to resend confirmation email.');
    }
  };

  async function createPvp() {

    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/pvps?id=${player.id}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      if (responseData.id) {
        const pvpId = responseData.id;
        router.push(`/pvp/${pvpId}`)
      }
      setPlayer(responseData.player)
    }
  }

  async function stopPvp() {

    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/stop_pvp?id=${player.id}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      setPlayer(responseData.player)
    }
  }

  const redirectZones = () => {
    if (deck.length == 4) {
      router.push("/game/Zones");
    } else {
      alert("You need a team with 5 members");
    }
  };

  useEffect(() => {

    const fetchCurrentPlayer = async () => {
      try {
        const json = await getPlayer();
        if (json.message === "Player not found.") {
          setNotFound(null);
        } else if (json.message === "Email not confirmed") {
          setNotFound("Email not confirmed for ")
          setEmail(json.email)
        } else {
          setPlayer(json);
        }
      }
      catch (error) {
        console.error("Failed to fetch the player: ", error);
      }
    };
    fetchCurrentPlayer();
  }, [authToken]);

  useEffect(() => {
    if (!player) return;
    const fetchCurrentDialogues = async () => {
      try {
        const json = await getDialogues();
        setDialogues(json);
        console.log("Current Page:", currentPage);
        console.log("dialogues:", dialogues);
        console.log("Displaying:", dialogues[currentPage]);

      } catch (error) {
        console.error("Failed to fetch the game: ", error);
      }
    };

    if (player) {
      fetchCurrentDialogues();
    }
  }, [player]);

  useEffect(() => {
    const fetchCurrentGame = async () => {
      try {
        const json = await getGame();
        setGame(json);
      } catch (error) {
        setGame(null);
        console.error("Failed to fetch the game: ", error);
      }
    };

    if (player) {
      fetchCurrentGame();
    }
  }, [player]);

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
  }, [player]);

  useEffect(() => {
    const fetchCurrentPvp = async () => {
      try {
        setPvp(player.in_pvp);
      } catch (error) {
        setPvp(null);
        console.error("Failed to fetch the game: ", error);
      }
    };

    if (player) {
      fetchCurrentPvp();
    }
  }, [player]);



  return (
    <>
      <Head>
        <title>DApp : Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CosmosBackground>
        <Layout pvp={pvp}>
          {player ? (
            <div className="App">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="https://res.cloudinary.com/dsiamykrd/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1728032580/Cosmos_jst1aj.webp"
                  alt="Cosmos Avatar"
                  style={{ width: '30%', height: 'auto' }}
                />
                {dialogues && (
                  <Box
                    bg="rgba(50, 50, 50, 0.9)"
                    borderRadius="20px"
                    boxShadow="0 4px 8px rgba(0, 0, 0, 0.5)"
                    padding="20px"
                    margin="20px"
                    maxWidth="600px"
                    height="200px"
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
                      {/* Bouton gauche pour la pagination */}
                      <Button
                        onClick={handlePrevious}
                        disabled={currentPage === 0}
                        marginRight="10px"
                        bg="gray.700" // Bouton gris foncé
                        color="white" // Texte blanc sur bouton
                        _hover={{ bg: "gray.600" }} // Changement de couleur au hover
                        _disabled={{ bg: "gray.500", cursor: "not-allowed" }} // Désactivation avec couleur plus claire
                      >
                        ◀
                      </Button>

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

                )}
              </div>
              <div>
                {player ? (
                  <>
                    <Link href="/player/[id]" as={`/player/${player.id}`}>
                      <button style={{
                        color: "#F9DC5C",
                        backgroundColor: "blue",
                        padding: "10px 50px",
                        margin: 10,
                        transition: "background-color 0.3s ease",
                        borderRadius: 5,
                        textDecoration: "none"
                      }} >Deck </button>
                    </Link>
                    {game && deck ? (
                      <Link href="/game/[id]" as={`/game/${game.id}`}>
                        <button style={{
                          color: "#F9DC5C",
                          backgroundColor: "green",
                          padding: "10px 50px",
                          margin: 10,
                          transition: "background-color 0.3s ease",
                          borderRadius: 5,
                          textDecoration: "none"
                        }} > Fight </button>
                      </Link>
                    ) : (
                      <>
                        {deck &&
                          <>
                            <button
                              onClick={redirectZones}
                              style={{
                                color: "#F9DC5C",
                                backgroundColor: "green",
                                padding: "10px 50px",
                                margin: 10,
                                transition: "background-color 0.3s ease",
                                borderRadius: 5,
                                textDecoration: "none"
                              }} > Play </button>
                          </>
                        }
                      </>
                    )
                    }
                    {/* {deck &&
                    <>
                      {
                        player.in_pvp == 'false' &&
                        <button
                          onClick={createPvp}
                          style={{
                            color: "#F9DC5C",
                            backgroundColor: "purple",
                            padding: "10px 50px",
                            margin: 10,
                            transition: "background-color 0.3s ease",
                            borderRadius: 5,
                            textDecoration: "none"
                          }} > PvP </button>
                      }
                      {player.in_pvp == 'wait' &&
                        <button
                          onClick={stopPvp}
                          style={{
                            color: "#F9DC5C",
                            backgroundColor: "purple",
                            padding: "10px 50px",
                            margin: 10,
                            transition: "background-color 0.3s ease",
                            borderRadius: 5,
                            textDecoration: "none"
                          }} >Leave PvP waiting list</button>
                      }
                      {player.in_pvp == 'true' && pvp &&
                        <Link href="/pvp/[id]" as={`/pvp/${pvp.id}`}>
                          <button style={{
                            color: "#F9DC5C",
                            backgroundColor: "purple",
                            padding: "10px 50px",
                            margin: 10,
                            transition: "background-color 0.3s ease",
                            borderRadius: 5,
                            textDecoration: "none"
                          }} > Fight </button>
                        </Link>
                      }
                    </>
                  } */}
                    {showAlert && <div>
                      <Alert status='warning' width="50%">
                        <AlertIcon />
                        Your Team is not complete!
                      </Alert>
                    </div>
                    }
                  </>
                ) :
                  <></>
                }
              </div>
            </div>
          ) : (<>
            {notFound ? (
              <div>
                <h1>User not found or email not confirmed.</h1>
                <div>
                  <button
                    onClick={handleResend}
                    style={{
                      color: "#F9DC5C",
                      backgroundColor: "green",
                      padding: "10px 50px",
                      margin: 10,
                      transition: "background-color 0.3s ease",
                      borderRadius: 5,
                      textDecoration: "none"
                    }} > Resend Confirmation Email </button>
                  {message && <p>{message}</p>}
                  {error && <p>{error}</p>}
                </div>
              </div>
            ) : (
              <Auth />
            )}
          </>
          )}
        </Layout>
      </CosmosBackground>
    </>
  )
}
