import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useProvider, useSigner } from 'wagmi'
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Flex,
    Image,
} from '@chakra-ui/react'
import Layout from '@/components/Layout/Layout';
import CosmosBackground from '@/components/CosmosBackground';
import Card from '@/components/Card';
import { useAuth } from '@/contexts/authContext';

const monster = () => {
    const { authToken } = useAuth();
    const { address, isConnected } = useAccount()
    const router = useRouter();
    const { id } = router.query;
    const [player, setPlayer] = useState(null);
    const [monster, setMonster] = useState(null)
    const [energy, setEnergy] = useState(null);
    const [addAlert, setAddAlert] = useState("");


    async function getPlayer() {
        const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_player?token=${authToken}`}`);
        return response.json();
    }

    async function getMonster() {
        const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cards/${id}?player_id=${player.id}`}`);
        return response.json();
    }

    async function increment(stat) {
        const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/increment_card?player_id=${player.id}&stat=${stat}&id=${monster.id}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const responseData = await response.json();
            setMonster(responseData.monster)

            if (responseData.message != "") {
                setAddAlert(responseData.message);
                setTimeout(() => {
                    setAddAlert("")
                }, 3000);
            }
        }
    }

    async function sell() {
        const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sell_card?player_id=${player.id}&id=${monster.id}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const responseData = await response.json();
            setMonster(responseData.monster)
        }
    }

    async function awake() {
        const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/awake_card?player_id=${player.id}&id=${monster.id}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const responseData = await response.json();
            setMonster(responseData.monster)
            if (responseData.message != "") {
                setAddAlert(responseData.message);
                setTimeout(() => {
                    setAddAlert("")
                }, 3000);
            }
        }
    }

    useEffect(() => {

        const fetchCurrentPlayer = async () => {
            try {
                const json = await getPlayer();
                setPlayer(json);
                setEnergy(json.energy)
            } catch (error) {
                console.error("Failed to fetch the player: ", error);
            }
        };
        if (!authToken) return;
        fetchCurrentPlayer();
    }, [address, authToken]);

    useEffect(() => {
        const fetchCurrentmonster = async () => {
            try {
                const json = await getMonster();
                setMonster(json.monster);
            } catch (error) {
                setMonster(null);
                console.error("Failed to fetch the monster: ", error);
            }
        };
        if (player) {
            fetchCurrentmonster();
        }
    }, [address, authToken, player]);

    useEffect(() => {
        const fetchCurrentPlayer = async () => {
            try {
                const json = await getPlayer();
                setEnergy(json.energy)
            } catch (error) {
                console.error("Failed to fetch the player: ", error);
            }
        };
        fetchCurrentPlayer();
    }, [player, monster]);

    const monsterCardStyle = (monster) => ({
        border: '1px solid #ddd',
        padding: '50px',
        borderRadius: '8px',
        textAlign: 'center',
        color: 'black',
        backgroundImage: `
        linear-gradient(to right, rgba(218,165,32, 0.7), rgba(139,69,19, 0.7))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    })


    const gridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        margin: '20px',
    };

    if (!player) return <h2>Loading...</h2>;
    if (!monster) return <h2>Loading...</h2>;

    return (
        <>
            <CosmosBackground>
                <Layout>
                    {player &&
                        <Link href="/player/[id]" as={`/player/${player.id}`}>
                            Back
                        </Link>
                    }
                    <div style={gridContainerStyle}>
                        <h2> Your spirit:</h2>
                        <div key={monster.id} style={monsterCardStyle(monster)} className="card">
                            <Image
                                src={monster.image || 'https://t4.ftcdn.net/jpg/01/68/49/67/240_F_168496711_iFQUk2vqAnnDpVzGm2mtp8u2gqgwZrY7.jpg'}
                                alt={monster.name}
                                borderRadius="8px"
                                boxSize="200px" // Taille de l'image
                                objectFit="cover"
                            />
                            <p style={{ background: "white", margin: '5px' }}> {monster.name}
                            </p>
                            <Flex>
                                <Card card={monster} />
                            </Flex>
                        </div>
                        <div>
                            points: {monster.copy} / Cardinum: {energy} {addAlert} / rank: {monster.rank}
                            {!monster.max && monster.up_points < (30 / monster.rank) ? (
                                <p>boost up: {monster.up_points} / {30 / monster.rank}
                                    {monster.copy > 0 &&
                                        <>
                                            <button onClick={() => increment(0)} style={{
                                                color: "#F9DC5C",
                                                backgroundColor: "grey",
                                                padding: "10px 10px",
                                                margin: 10,
                                                transition: "background-color 0.3s ease",
                                                borderRadius: 5,
                                                textDecoration: "none"
                                            }} > +
                                            </button>
                                            <span> (- {monster.up_points * 10 * monster.rank} Cardinum )</span>
                                        </>
                                    }
                                </p>) : (
                                <p>
                                    Up Max!
                                </p>
                            )
                            }
                            {!monster.max && monster.right_points < (30 / monster.rank) ? (
                                <p>boost right: {monster.right_points} / {30 / monster.rank}
                                    {monster.copy > 0 &&
                                        <>
                                            <button onClick={() => increment(1)} style={{
                                                color: "#F9DC5C",
                                                backgroundColor: "grey",
                                                padding: "10px 10px",
                                                margin: 10,
                                                transition: "background-color 0.3s ease",
                                                borderRadius: 5,
                                                textDecoration: "none"
                                            }} > +
                                            </button>
                                            <span> (- {monster.right_points * 10 * monster.rank} Cardinum )</span>
                                        </>
                                    }
                                </p>
                            ) : (
                                <p>
                                    Right Max!
                                </p>
                            )
                            }
                            {!monster.max && monster.down_points < (30 / monster.rank) ? (
                                <p>boost down: {monster.down_points} / {30 / monster.rank}
                                    {monster.copy > 0 &&
                                        <>
                                            <button onClick={() => increment(2)} style={{
                                                color: "#F9DC5C",
                                                backgroundColor: "grey",
                                                padding: "10px 10px",
                                                margin: 10,
                                                transition: "background-color 0.3s ease",
                                                borderRadius: 5,
                                                textDecoration: "none"
                                            }} > +
                                            </button>
                                            <span> (- {monster.down_points * 10 * monster.rank} Cardinum )</span>
                                        </>
                                    }
                                </p>
                            ) : (
                                <p>
                                    Down Max!
                                </p>
                            )
                            }
                            {!monster.max && monster.left_points < (30 / monster.rank) ? (
                                <p>boost left: {monster.left_points} / {30 / monster.rank}
                                    {monster.copy > 0 &&
                                        <>
                                            <button onClick={() => increment(3)} style={{
                                                color: "#F9DC5C",
                                                backgroundColor: "grey",
                                                padding: "10px 10px",
                                                margin: 10,
                                                transition: "background-color 0.3s ease",
                                                borderRadius: 5,
                                                textDecoration: "none"
                                            }} > +
                                            </button>
                                            <span> (- {monster.left_points * 10 * monster.rank} Cardinum )</span>
                                        </>
                                    }
                                </p>
                            ) : (
                                <p>
                                    Left Max!
                                </p>
                            )
                            }
                        </div>
                    </div>
                    {!monster.max && monster.copy > 0 && <button onClick={() => sell()} style={{
                        color: "#F9DC5C",
                        backgroundColor: "blue",
                        padding: "10px 10px",
                        margin: 10,
                        transition: "background-color 0.3s ease",
                        borderRadius: 5,
                        textDecoration: "none"
                    }} > sell 1 copy (+{monster.rank * 50} Cardinum)
                    </button>
                    }
                    {!monster.max && (monster.up_points + monster.right_points + monster.down_points + monster.left_points) == ((30 / monster.rank) * 4) &&
                        <button onClick={() => awake()} style={{
                            color: "#F9DC5C",
                            backgroundColor: "purple",
                            padding: "10px 10px",
                            margin: 10,
                            transition: "background-color 0.3s ease",
                            borderRadius: 5,
                            textDecoration: "none"
                        }} > awake (-{(30 / monster.rank) * 4} points & -{4650 * monster.rank} Cardinum)
                        </button>
                    }
                </Layout>
            </CosmosBackground>
        </>
    )
}

export default monster