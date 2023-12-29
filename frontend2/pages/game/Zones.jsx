import React from 'react'
import { useAccount } from 'wagmi'
import Layout from '@/components/Layout/Layout'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/authContext';
import Link from 'next/link';



const Zones = () => {
  const { authToken } = useAuth();
  const { address, isConnected } = useAccount()
  const [player, setPlayer] = useState(null);
  const [pvp, setPvp] = useState(null);
  const [game, setGame] = useState(null);
  const router = useRouter();
  const [numberOfRounds, setNumberOfRounds] = useState(1);

  async function getPlayer() {
    const response = await fetch(`${`http://localhost:3000/api/v1/find?address=${address}&token=${authToken}`}`);
    return response.json();
  }

  async function getGame() {
    const response = await fetch(`${`http://localhost:3000/api/v1/find_game?address=${address}&token=${authToken}`}`);
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
  }, [address, authToken]);

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

  async function createGame() {

    const response = await fetch(`${`http://localhost:3000/api/v1/games?address=${address}&token=${authToken}&rounds=${numberOfRounds}`}`,
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

  async function selectZone(zone) {

    const response = await fetch(`${`http://localhost:3000/api/v1/select_zone?address=${address}&token=${authToken}&zone=${zone}`}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      setPlayer(responseData)
    }
  }
  return (
    <Layout pvp={pvp}>
      {player ? (
        <>
          <h2>Name: {player.name} Energy: {player.energy} Elite Points: {player.elite_points}</h2>
          <p> current position: {player.zone_position} </p>
          <div style={{ display: "flex" }}>
            <div >
              {player.zone_position == 'A1' ? (
                <button style={{
                  color: "#F9DC5C",
                  backgroundColor: "grey",
                  padding: "10px 50px",
                  margin: 10,
                  transition: "background-color 0.3s ease",
                  borderRadius: 5,
                  textDecoration: "none"
                }} > A1 📍</button>
              ) : (
                <button onClick={() => selectZone("A1")} style={{
                  color: "#F9DC5C",
                  backgroundColor: "blue",
                  padding: "10px 50px",
                  margin: 10,
                  transition: "background-color 0.3s ease",
                  borderRadius: 5,
                  textDecoration: "none"
                }} > A1 </button>
              )
              }
            </div>
            <div >
              {player.zone_position == 'A2' ? (
                <button style={{
                  color: "#F9DC5C",
                  backgroundColor: "grey",
                  padding: "10px 50px",
                  margin: 10,
                  transition: "background-color 0.3s ease",
                  borderRadius: 5,
                  textDecoration: "none"
                }} > A2 📍</button>
              ) : (
                <>
                  {
                    player.monsters.length > 3 ? (

                      <button onClick={() => selectZone("A2")} style={{
                        color: "#F9DC5C",
                        backgroundColor: "blue",
                        padding: "10px 50px",
                        margin: 10,
                        transition: "background-color 0.3s ease",
                        borderRadius: 5,
                        textDecoration: "none"
                      }} > A2 </button>
                    ) : (
                      <button style={{
                        color: "#F9DC5C",
                        backgroundColor: "purple",
                        padding: "10px 50px",
                        margin: 10,
                        transition: "background-color 0.3s ease",
                        borderRadius: 5,
                        textDecoration: "none"
                      }} > A2 🔒 {player.monsters.length}/4 monsters </button>
                    )
                  }
                </>
              )
              }
            </div>

          </div>
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
            }} > Hunt </button>
          )}
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