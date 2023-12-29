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



const Header = ({pvp}) => {
    const { clearToken, authToken, setToken } = useAuth();
    const { address, isConnected } = useAccount()
    const [player, setPlayer] = useState(null);

    async function getPlayer() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find?token=${authToken}`}`);
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



    return (
        <Flex justifyContent="space-between" alignItems="center" height="10vh" width="100%" p="2rem">
            {authToken &&
                <div>
                    <button className='' onClick={clearToken}>LogOut</button>
                </div>
            }
            {player && pvp == 'wait' &&
                <div>
                    <button >PvP: waiting List</button>
                </div>
            }
            {player && pvp == 'true' &&
                 <Link href="/pvp/[id]" as={`/pvp/${game.id}`}>
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
                            Dashboard
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