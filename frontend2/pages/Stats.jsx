import Layout from '@/components/Layout/Layout'
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Auth from './Auth'
import { useAuth } from '@/contexts/authContext';



export default function Stats() {
    const [player, setPlayer] = useState(null);
    const [pnj, setPnj] = useState(null);
    const { authToken } = useAuth();

    async function getPlayer() {
        const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_player?token=${authToken}`}`);
        return response.json();
    }

    async function getPnj() {
        const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_pnj?player_id=${player.id}`}`);
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
    }, [authToken]);

    useEffect(() => {
        const fetchCurrentPnj = async () => {
            try {
                const json = await getPnj();
                setPnj(json);
            } catch (error) {
                console.error("Failed to fetch the player: ", error);
            }
        };
        fetchCurrentPnj();
    }, [player]);


    if (!player) return <h2>Loading...</h2>;
    if (!pnj) return <h2>Loading...</h2>;


    return (
        <>
            <Layout >
                {player && pnj ? (
                    <div>
                        <>
                            <h2>try: {pnj.try}</h2>
                            <h2>victory: {pnj.victory}</h2>
                            <h2>defeat: {pnj.defeat}</h2>
                            <h2>perfect: {pnj.perfect}</h2>
                            <h2>boss: {pnj.boss}</h2>
                            <h2>Monsters Awake: {pnj.awake}</h2>
                            <h2>Zone Max: {player.zones.slice(-1)[0]}</h2>
                            <h2>Monsters: {player.monsters.length}</h2>

                        </>

                    </div>
                ) : ((<Alert status='warning' width="50%">
                    <AlertIcon />
                    Please, login or create account
                </Alert>)
                )}
            </Layout>
        </>
    )
}
