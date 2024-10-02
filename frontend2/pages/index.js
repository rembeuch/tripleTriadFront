import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { Text } from '@chakra-ui/react'
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


  async function getPlayer() {
    const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_player?token=${authToken}`}`);
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
      window.location.href = "/game/Zones";
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
      <Layout pvp={pvp}>
        {player ? (
          <div className="App">
            <div>
              {player ? (
                <>
                  <h2>Name: {player.name}</h2>

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
    </>
  )
}
