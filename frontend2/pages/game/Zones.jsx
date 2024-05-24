import React from 'react'
import { useAccount } from 'wagmi'
import Layout from '@/components/Layout/Layout'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/authContext';
import Card from '@/components/Card';
import Link from 'next/link';



const Zones = () => {
  const { authToken } = useAuth();
  const { address, isConnected } = useAccount()
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [pvp, setPvp] = useState(null);
  const [game, setGame] = useState(null);
  const [monsters, setMonsters] = useState(null);
  const [zoneMonsters, setZoneMonsters] = useState(null);
  const [sMonsters, setSMonsters] = useState(null);
  const [copy, setCopy] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [addAlert, setAddAlert] = useState("");
  const [numberOfRounds, setNumberOfRounds] = useState(1);

  async function getPlayer() {
    const response = await fetch(`${`http://localhost:3000/api/v1/find_player?token=${authToken}`}`);
    return response.json();
  }

  async function getGame() {
    const response = await fetch(`${`http://localhost:3000/api/v1/find_game?id=${player.id}`}`);
    return response.json();
  }

  async function getMonsters() {
    const response = await fetch(`${`http://localhost:3000/api/v1/find_monsters?player_id=${player.id}`}`);
    return response.json();
  }

  async function createGame() {

    const response = await fetch(`${`http://localhost:3000/api/v1/games?id=${player.id}&rounds=${numberOfRounds}`}`,
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
    const response = await fetch(`${`http://localhost:3000/api/v1/quit_game?id=${player.id}`}`,
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
    const response = await fetch(`${`http://localhost:3000/api/v1/sell_market?player_id=${player.id}&index=${index}`}`,
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
    const response = await fetch(`${`http://localhost:3000/api/v1/buy_market?player_id=${player.id}&index=${index}`}`,
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
    fetchCurrentPlayer();
  }, [address, authToken, addAlert]);

  useEffect(() => {
    const fetchCurrentMonsters = async () => {
      try {
        const json = await getMonsters();
        setMonsters(json.monsters);
        setZoneMonsters(json.zone_monsters);
        if (player.s_zone) {
          setSMonsters(json.s_monsters);
          setCopy(json.copy);
        }
      } catch (error) {
        setMonsters(null);
        console.error("Failed to fetch the game: ", error);
      }
    };
    if (player) {
      fetchCurrentMonsters();
    }
  }, [player, addAlert]);

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
    if (player) {
      setPvp(player.in_pvp);
    }
  }, [player]);


  // async function selectZone(zone) {
  //   if (player.in_game == false) {
  //     const response = await fetch(`${`http://localhost:3000/api/v1/select_zone?address=${address}&token=${authToken}&zone=${zone}`}`,
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
  return (
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
          <h2>Name: {player.name} / Energy: {player.energy} / Elite Points: {player.elite_points} / Zone Max: {player.zones.slice(-1)[0]} / Total Monsters: {player.monsters.length}</h2>
          <p>current ability: {player.ability}
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
                }} > Change Deck</button>
              </Link>
            }
            <br />
            current zone: {player.zone_position}
            {player.zones.includes(player.zone_position) && monsters && zoneMonsters &&
              <p>Monsters in this zone {monsters} / {zoneMonsters}</p>
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
            <button onClick={() => createGame()} style={{
              color: "#F9DC5C",
              backgroundColor: "green",
              padding: "10px 50px",
              margin: 10,
              transition: "background-color 0.3s ease",
              borderRadius: 5,
              textDecoration: "none"
            }} > Start Game {player.zones[0].slice(0, 5) == "bossA" && player.zone_position[0] == "A" && "💀"} {player.zones[0].slice(0, 5) == "bossB" && "💀"} {player.zones.length > 1 && player.zones[1].slice(0, 5) == "bossB" && player.zone_position[0] == "B" && "💀"}</button>
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
                            {card.rank * 100 + (player.monsters.includes(card.name) ? 100 : 200)} energy
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
                        }} > sell 1 copy (+{card.rank * 100} energy)
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
                }} > Quit and Back to A1 </button>
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
                    }} > Boost Team </button>
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
  )
}

export default Zones