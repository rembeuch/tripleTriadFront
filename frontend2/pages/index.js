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
  const [zonePnj, setZonePnj] = useState(null);


  const handleNext = () => {
    if (currentPage < dialogues.dialogues.length - 1) {
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

  async function getZonePnj() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_zone_pnj?player_id=${player.id}`}`);
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
      alert("You need 4 Spirits in your Compass");
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

      } catch (error) {
        console.error("Failed to fetch the game: ", error);
      }
    };

    if (player) {
      fetchCurrentDialogues();
    }
  }, [player]);

  useEffect(() => {
    const fetchCurrentPnj = async () => {
      try {
        const json = await getZonePnj();
        setZonePnj(json.zone_pnj);
        setZone(json.zone)
      } catch (error) {
        console.error("Failed to fetch the player: ", error);
      }
    };
    if (player) {
      fetchCurrentPnj();
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
                {dialogues && dialogues.dialogues && dialogues.images && (
                  <>
                    <img
                      src={dialogues.images[currentPage]}
                      alt="Cosmos Avatar"
                      style={{ width: '200px', height: '200px' }}
                    />
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
                        {dialogues.dialogues[currentPage]}
                      </Text>

                      {/* Conteneur pour les boutons de navigation */}
                      <Box display="flex" justifyContent="center" alignItems="center">
                        {/* Afficher le bouton précédent uniquement si la page actuelle n'est pas la première */}
                        {currentPage > 0 && (
                          <Button
                            onClick={handlePrevious}
                            marginRight="10px"
                            bg="gray.700"
                            color="white"
                            _hover={{ bg: "gray.600" }}
                            _disabled={{ bg: "gray.500", cursor: "not-allowed" }}
                          >
                            ◀
                          </Button>
                        )}

                        {/* Afficher le bouton suivant uniquement si la page actuelle n'est pas la dernière */}
                        {currentPage < dialogues.dialogues.length - 1 && (
                          <Button
                            onClick={handleNext}
                            marginLeft="10px"
                            bg="gray.700"
                            color="white"
                            _hover={{ bg: "gray.600" }}
                            _disabled={{ bg: "gray.500", cursor: "not-allowed" }}
                          >
                            ▶
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </>
                )}
              </div>
              <div>
                {player && dialogues.dialogues ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                    <Link href="/player/[id]" as={`/player/${player.id}`}>
                      <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <div style={{
                          border: '2px solid #F9DC5C',
                          borderRadius: '15px',
                          padding: '20px',
                          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                          display: 'inline-block',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          boxShadow: dialogues.dialogues[3] === "Go check your Spirits!" && currentPage === 3
                            ? "0 0 30px 10px rgba(255, 215, 0, 0.9)"
                            : "none",
                          opacity: dialogues.dialogues[3] === "Go check your Spirits!" && currentPage === 3 ? 1 : 0.8,
                        }}>
                          <h2 style={{
                            color: "#F9DC5C",
                            marginBottom: '10px',
                            fontSize: '24px',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                            textAlign: 'center'
                          }}>
                            Spirits
                          </h2>

                          <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',   // Aligne les cartes en haut pour éviter qu'elles ne chevauchent le titre
                            gap: '10px',                // Espacement entre les cartes
                          }}>
                            {deck && deck.length > 0 ? (
                              deck.map((card, index) => (
                                <img
                                  key={index}
                                  src={card.image} // Accède à la propriété 'image' de chaque carte
                                  alt={`Card ${index + 1}`}
                                  style={{
                                    width: '80px',
                                    height: '120px',
                                    transition: 'transform 0.3s ease', // Effet au survol
                                    cursor: 'pointer'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} // Zoom au survol
                                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Retour à la taille d'origine
                                />
                              ))
                            ) : (
                              <img
                                src={"https://res.cloudinary.com/dsiamykrd/image/upload/v1728113281/compass_b9qu84.webp"}
                                alt={`Empty card`}
                                style={{
                                  width: '200px',
                                  height: '220px',
                                  transition: 'transform 0.3s ease', // Effet au survol
                                  cursor: 'pointer'
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>

                    {game && deck ? (
                      <Link href="/game/[id]" as={`/game/${game.id}`}>
                        <button style={{
                          border: '2px solid #F9DC5C',
                          borderRadius: '15px',
                          padding: '20px',
                          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                          display: 'inline-block',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        }} > Fight </button>
                      </Link>
                    ) : (
                      <>
                        {deck && zonePnj && (
                          <div
                            onClick={redirectZones} // Redirection lors du clic
                            style={{
                              position: 'relative',
                              border: '2px solid #F9DC5C',
                              borderRadius: '15px',
                              padding: '20px',
                              boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                              display: 'inline-block',
                              backgroundImage: `url(${zonePnj.zone_image})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              width: '200px',  // Ajuste la largeur si besoin
                              height: '300px', // Ajuste la hauteur si besoin
                              cursor: 'pointer',
                              transition: 'transform 0.3s ease',
                              display: 'flex',  // Permet d'aligner le titre et le contenu de la div
                              flexDirection: 'column',
                              justifyContent: 'flex-start',  // Positionne le titre en haut
                              alignItems: 'center',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} // Zoom au survol
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}  // Retour à la taille d'origine
                          >
                            {/* Titre "Play" en haut de la div, au-dessus du fond */}
                            <h2
                              style={{
                                color: '#F9DC5C',
                                fontSize: '24px',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                marginBottom: '10px',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Optionnel: ajoute un fond semi-transparent pour améliorer la lisibilité
                                padding: '5px 10px',  // Un peu d'espace autour du texte
                                borderRadius: '10px',  // Arrondit les bords
                                zIndex: 1,  // Assure que le titre est au-dessus de l'image de fond
                              }}
                            >
                              Play
                            </h2>

                            {/* Autres éléments à l'intérieur de la div si besoin */}
                          </div>

                        )}
                      </>
                    )}
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
                  </div>
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
