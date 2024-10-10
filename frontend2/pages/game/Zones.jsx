import React from 'react'
import { useAccount } from 'wagmi'
import Layout from '@/components/Layout/Layout'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Box,
  Button,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/authContext';
import Card from '@/components/Card';
import Link from 'next/link';
import ZoneBackground from '@/components/ZoneBackground';



const Zones = () => {
  const { authToken } = useAuth();
  const { address, isConnected } = useAccount()
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [pvp, setPvp] = useState(null);
  const [game, setGame] = useState(null);
  const [deck, setDeck] = useState([]);
  const [monsters, setMonsters] = useState(null);
  const [sMonsters, setSMonsters] = useState(null);
  const [copy, setCopy] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [addAlert, setAddAlert] = useState("");
  const [numberOfRounds, setNumberOfRounds] = useState(1);
  const [zonePnj, setZonePnj] = useState(null);
  const [zone, setZone] = useState(null);
  const [dialogues, setDialogues] = useState([])
  const [currentPage, setCurrentPage] = useState(0);

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
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/display_pnj_dialogue?player_id=${player.id}`}`);
    return response.json();
  }

  async function getGame() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_game?id=${player.id}`}`);
    return response.json();
  }

  async function getDeck() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/deck?id=${player.id}`}`);
    return response.json();
  }

  async function getMonsters() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_monsters?player_id=${player.id}`}`);
    return response.json();
  }

  async function getZonePnj() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_zone_pnj?player_id=${player.id}`}`);
    return response.json();
  }

  async function createGame() {

    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/games?id=${player.id}&rounds=${numberOfRounds}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      const gameId = responseData.id;
      router.push(`/game/${gameId}`)
    } else {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false)
      }, 3000);
    }
  }

  async function quitGame() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quit_game?id=${player.id}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    window.location.href = "/game/Zones";
  }

  async function sellMarket(index) {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sell_market?player_id=${player.id}&index=${index}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      setAddAlert(responseData.message);
      setTimeout(() => {
        setAddAlert("")
      }, 3000);

    }

  }

  async function buyMarket(index) {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/buy_market?player_id=${player.id}&index=${index}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      setAddAlert(responseData.message);
      setTimeout(() => {
        setAddAlert("")
      }, 3000);

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
    if (!player) return;
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
    if (!player) return;

    const fetchCurrentMonsters = async () => {
      try {
        const json = await getMonsters();
        setMonsters(json.monsters);
        if (player.s_zone) {
          setSMonsters(json.s_monsters);
          setCopy(json.copy);
        }
      } catch (error) {
        console.error("Failed to fetch the monsters: ", error);
      }
    };

    fetchCurrentMonsters();
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
    const fetchCurrentPnj = async () => {
      try {
        const json = await getZonePnj();
        console.log(json.zone)
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
    if (player) {
      setPvp(player.in_pvp);
    }
  }, [player]);


  // async function selectZone(zone) {
  //   if (player.in_game == false) {
  //     const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/select_zone?address=${address}&token=${authToken}&zone=${zone}`}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (response.ok) {
  //       const responseData = await response.json();
  //       setPlayer(responseData)
  //     }
  //   }
  // }

  const eliteCardStyle = {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    backgroundImage: 'url(" https://t4.ftcdn.net/jpg/01/68/49/67/240_F_168496711_iFQUk2vqAnnDpVzGm2mtp8u2gqgwZrY7.jpg")',
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    margin: '5px'
  };

  if (!player) return <h2>Loading...</h2>;
  if (!zonePnj) return <h2>Loading...</h2>;

  return (
    <ZoneBackground zonePnj={zonePnj}>
      <Layout pvp={pvp}>
        {player ? (
          <>
            {showAlert && <div>
              <Alert status='warning' width="50%">
                <AlertIcon />
                Your Team is not complete!
              </Alert>
            </div>
            }
            <h2 style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent derrière l'ensemble du texte
              padding: "16px", // Ajoute de l'espace autour du texte
              borderRadius: "10px",
              textAlign: 'center' // Bordures arrondies pour un meilleur style
            }}
            >
              🌍 Current zone: {zone} / Cardinum ⚡ : {player.energy} / Diamonds 💎: {player.elite_points}
              <br />

              {player.zones.includes(player.zone_position) && (
                <span>
                  🧭 Spirits Sealed in this zone: {monsters}
                </span>
              )}
              {player.power_condition && player.monster_condition && (
                <p>
                  ✨ Bonus condition (+20 Cardinum after each zone) ability: {player.power_condition} & monster in your deck: {player.monster_condition}{" "}
                  {player.ability === player.power_condition && player.decks.includes(player.monster_condition) ? "✅" : "❌"}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center' }}>
                {dialogues && dialogues.dialogues && dialogues.images && (
                  <>
                    <img
                      src={dialogues.images[currentPage]}
                      alt="Cosmos Avatar"
                      style={{ width: '200px', height: '200px' }} // Hauteur et largeur fixes
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
            </h2>
            <p style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent derrière l'ensemble du texte
              padding: "12px", // Ajoute de l'espace autour du texte
              borderRadius: "10px", // Bordures arrondies pour un meilleur style
            }}
            > 🎯 Current ability: {player.ability}
              {player.zone_position == "A1" && player.in_pvp == "false" && player.in_game == false &&
                <Link href="/player/[id]" as={`/player/${player.id}`}>
                  <button style={{
                    color: "#F9DC5C",
                    backgroundColor: "blue",
                    padding: "10px 50px",
                    margin: 10,
                    transition: "background-color 0.3s ease",
                    borderRadius: 5,
                    textDecoration: "none"
                  }} > Change Spirits</button>
                </Link>
              }
            </p>

            {game ? (
              <Link href="/game/[id]" as={`/game/${game.id}`}>
                <button style={{
                  color: "#F9DC5C",
                  backgroundColor: "green",
                  padding: "10px 50px",
                  margin: 10,
                  transition: "background-color 0.3s ease",
                  borderRadius: 5,
                  textDecoration: "none"
                }} > Current Fight </button>
              </Link>
            ) : (
              <>
              {deck.length == 4 ? (
                <button onClick={() => createGame()} style={{
                color: "#F9DC5C",
                backgroundColor: "green",
                padding: "10px 50px",
                margin: 10,
                transition: "background-color 0.3s ease",
                borderRadius: 5,
                textDecoration: "none"
              }} > Hunt Spirit {player.zone_position[player.zone_position.length - 1] == "5" && player.zone_position[0] == "A" && "💀"} {player.zone_position[player.zone_position.length - 1] == "0" && player.zone_position[0] == "A" && "💀"} {player.zones[0].slice(0, 5) == "bossA" && "💀"}  {player.zones[0].slice(0, 5) == "bossB" && "💀"} {player.zones.length > 1 && player.zones[1].slice(0, 5) == "bossB" && player.zone_position[0] == "B" && "💀"}</button>
            
              ) : 
              (
                <div>
                  You need 4 spirits in your Compass!
                </div>
              )}
            </>
            )}
            {player.s_zone && player.in_pvp == "false" && player.in_game == false && sMonsters && copy &&
              <>
                <h2>Market</h2>
                {addAlert}
                <div style={{ display: 'flex' }}>
                  <div style={gridContainerStyle}>
                    {sMonsters.slice(0, 2).map((card, index) => (
                      <>
                        <div key={card.id} style={eliteCardStyle} className="card">
                          <p style={{ background: "white", margin: '5px' }}> {card.name} /  {(player.monsters.includes(card.name) ? `copy ${copy[index]}` : "not in your deck")}</p>
                          <Flex>
                            <Card card={card} />
                          </Flex>
                          <button onClick={() => buyMarket(index)} style={{
                            color: "#F9DC5C",
                            backgroundColor: "blue",
                            padding: "10px 10px",
                            margin: 10,
                            transition: "background-color 0.3s ease",
                            borderRadius: 5,
                            textDecoration: "none"
                          }} >
                            <p style={{ margin: '5px' }}> Buy for {' '}
                              {card.rank * 100 + (player.monsters.includes(card.name) ? 100 : 200)} Cardinum
                            </p>
                          </button>
                        </div>
                      </>
                    ))}
                  </div >
                  <div style={gridContainerStyle}>
                    {sMonsters.slice(2, 4).map((card, index) => (
                      <>
                        <div key={card.id} style={eliteCardStyle} className="card">
                          <p style={{ background: "white", margin: '5px' }}> {card.name} / copy {copy[index + 2]}</p>
                          <Flex>
                            <Card card={card} />
                          </Flex>
                          <button onClick={() => sellMarket(index + 2)} style={{
                            color: "#F9DC5C",
                            backgroundColor: "purple",
                            padding: "10px 10px",
                            margin: 10,
                            transition: "background-color 0.3s ease",
                            borderRadius: 5,
                            textDecoration: "none"
                          }} > sell 1 copy (+{card.rank * 100} Cardinum)
                          </button>
                        </div>
                      </>
                    ))}

                  </div >
                </div>
              </>
            }
            {player.zone_position != "A1" &&
              <>
                <div style={{ display: 'flex' }}>
                  <button onClick={() => quitGame()} style={{
                    color: "#F9DC5C",
                    backgroundColor: "red",
                    padding: "10px 50px",
                    margin: 10,
                    transition: "background-color 0.3s ease",
                    borderRadius: 5,
                    textDecoration: "none"
                  }} > Quit and Back to the sanctuary </button>
                  {player.s_zone && player.in_pvp == "false" && player.in_game == false &&
                    <Link href="/player/[id]" as={`/player/${player.id}`}>
                      <button style={{
                        color: "#F9DC5C",
                        backgroundColor: "blue",
                        padding: "10px 50px",
                        margin: 10,
                        transition: "background-color 0.3s ease",
                        borderRadius: 5,
                        textDecoration: "none"
                      }} > Boost Spirit </button>
                    </Link>
                  }
                </div>
              </>
            }
          </>
        ) : (
          <Alert status='warning' width="50%">
            <AlertIcon />
            Loading
          </Alert>
        )}
      </Layout>
    </ZoneBackground>
  )
}

export default Zones