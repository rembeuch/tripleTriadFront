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



const NewGameForm = () => {
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

    const handleInputChange = (event) => {
        const newValue = Math.max(1, Math.min(10, parseInt(event.target.value, 10)));
        setNumberOfRounds(newValue);
    };

    const incrementRounds = () => {
        setNumberOfRounds((prevRounds) => Math.min(prevRounds + 1, 10));
    };

    const decrementRounds = () => {
        setNumberOfRounds((prevRounds) => Math.max(prevRounds - 1, 1));
    };

    async function createGameUrl() {

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
                    <label style={{ marginRight: '10px' }}>
                        Number of rounds:
                        <input
                            type="number"
                            value={numberOfRounds}
                            onChange={handleInputChange}
                            min={1}
                            max={10}
                            style={{
                                marginLeft: '5px',
                                marginRight: '5px',
                                textAlign: 'center',
                                width: '40px',
                            }}
                        />
                    </label>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <button style={{
                            color: "#F9DC5C",
                            backgroundColor: "red",
                            padding: "10px 50px",
                            margin: 10,
                            transition: "background-color 0.3s ease",
                            borderRadius: 5,
                            textDecoration: "none"
                        }} onClick={decrementRounds}>-</button>
                        <button style={{
                            color: "#F9DC5C",
                            backgroundColor: "blue",
                            padding: "10px 50px",
                            margin: 10,
                            transition: "background-color 0.3s ease",
                            borderRadius: 5,
                            textDecoration: "none"
                        }} onClick={incrementRounds}>+</button>
                    </div>
                    <button onClick={() => createGameUrl()} style={{
                        color: "#F9DC5C",
                        backgroundColor: "green",
                        padding: "10px 50px",
                        margin: 10,
                        transition: "background-color 0.3s ease",
                        borderRadius: 5,
                        textDecoration: "none"
                    }} > Create Game </button>
                </>
            ) : (
                <Alert status='warning' width="50%">
                <AlertIcon />
                Please, login or create account
              </Alert>
            )}
        </Layout>
    )
}

export default NewGameForm