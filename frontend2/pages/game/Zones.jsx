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



const Zones = () => {
    const { authToken } = useAuth();
    const { address, isConnected } = useAccount()
    const [player, setPlayer] = useState(null);

    const router = useRouter();
    const [numberOfRounds, setNumberOfRounds] = useState(1);

    async function getPlayer() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find?address=${address}&token=${authToken}`}`);
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
    return (
        <Layout>
            {player ? (
                <>
                {player.zones.map(zone => (
                  <>
                    <div key={zone} className="card">
                      <p style={{ background: "white", margin: '5px' }}> Zone #{zone}</p>
                        <button onClick={() => createGame()} style={{
                            color: "#F9DC5C",
                            backgroundColor: "green",
                            padding: "10px 50px",
                            margin: 10,
                            transition: "background-color 0.3s ease",
                            borderRadius: 5,
                            textDecoration: "none"
                        }} > Hunt </button>
                    </div>
                  </>
                ))}
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