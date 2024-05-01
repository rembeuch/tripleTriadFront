import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ethers } from 'ethers'
import { contractAddress, abi } from "../../public/constants"
import { useAccount, useSigner, useProvider } from 'wagmi'
import { useState, useEffect } from 'react';
import useOwnerAddress from "../../hooks/useOwnerAddress";
import { useAuth } from '@/contexts/authContext';
import Player from '@/pages/player/[id]';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'



const Header = ({ pvp }) => {
    const { clearToken, authToken, setToken } = useAuth();
    const { address, isConnected } = useAccount()
    const [player, setPlayer] = useState(null);
    const [playerPvp, setPlayerPvp] = useState(null);
    const [pvpMessage, setPvpMessage] = useState(false);

    async function getPlayer() {
        if (authToken) {
            const response = await fetch(`${`http://localhost:3000/api/v1/find?token=${authToken}`}`);
            return response.json();
        }
    }

    async function getPvp() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find_pvp?token=${authToken}`}`);
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
    }, [address, authToken, isConnected]);

    useEffect(() => {

        const fetchPvp = async () => {
            try {
                const json = await getPvp();
                setPlayerPvp(json);
            } catch (error) {
                console.error("Failed to fetch the player: ", error);
            }
        };

        if (pvp == "true") {
            fetchPvp();
        }
        if (pvp == 'wait' && player) {

            const newWs = new WebSocket('ws://localhost:3000/cable');
            newWs.onopen = () => {

                newWs.send(
                    JSON.stringify({
                        command: "subscribe",
                        identifier: JSON.stringify({
                            id: player.id,
                            channel: "PvpsChannel",
                        }),
                    })
                );
            };
            newWs.onmessage = function (event) {
                const data = JSON.parse(event.data);
                if (data.type === "ping") return
                if (data.type === "welcome") return
                if (data.type === "confirm_subscription") return
                const message = data.message;
                if (message.message == "pvp" && message.id == player.id) {
                    console.log(message)
                    setPvpMessage(true)
                    fetchPvp();
                }
            };
        }
    }, [pvp, playerPvp, player]);


    return (
        <Flex justifyContent="space-between" alignItems="center" height="10vh" width="100%" p="2rem">
            {authToken &&
                <div>
                    <button className='' onClick={clearToken}>LogOut</button>
                </div>
            }
            {player && pvp == 'wait' && pvpMessage == false ? (
                <div>
                    <button>PvP: waiting List</button>
                </div>
            )
                :
                (
                    <>
                        {playerPvp && pvp == "wait" &&

                            <Link href="/pvp/[id]" as={`/pvp/${playerPvp.id}`}>
                                <button style={{
                                    color: "#F9DC5C",
                                    backgroundColor: "purple",
                                    padding: "10px 50px",
                                    margin: 10,
                                    transition: "background-color 0.3s ease",
                                    borderRadius: 5,
                                    textDecoration: "none"
                                }} > PVP Fight </button>
                            </Link>
                        }
                    </>
                )

            }
            {player && pvp == 'true' && playerPvp &&
                <Link href="/pvp/[id]" as={`/pvp/${playerPvp.id}`}>
                    <button style={{
                        color: "#F9DC5C",
                        backgroundColor: "purple",
                        padding: "10px 50px",
                        margin: 10,
                        transition: "background-color 0.3s ease",
                        borderRadius: 5,
                        textDecoration: "none"
                    }} > PVP Fight </button>
                </Link>
            }
            <div status='warning' width="100%" id="alert">
            </div>

            <Flex width="30%" justifyContent="space-between" alignItems="center">
                <Text
                    fontWeight="bold"
                    sx={{
                        ':hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    {player &&
                        <Link href="/player/[id]" as={`/player/${player.id}`}>
                            Deck
                        </Link>
                    }
                </Text>
                <Text
                    fontWeight="bold"
                    sx={{
                        ':hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    {player &&
                        <Link href="/game/Zones">
                            Zones
                        </Link>
                    }
                </Text>
                <Text
                    fontWeight="bold"
                    sx={{
                        ':hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    <Link href="/" passHref>
                        Home
                    </Link>
                </Text>
            </Flex>
        </Flex>
    )
}

export default Header;