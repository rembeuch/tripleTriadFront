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
} from '@chakra-ui/react'
import Layout from '@/components/Layout/Layout';
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


    async function getPlayer() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find?token=${authToken}`}`);
        return response.json();
    }

    async function getMonster() {
        const response = await fetch(`${`http://localhost:3000/api/v1/cards/${id}?token=${authToken}`}`);
        return response.json();
    }

    async function increment(stat) {
        const response = await fetch(`${`http://localhost:3000/api/v1/increment_card?token=${authToken}&stat=${stat}&id=${monster.id}`}`,
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

    const monsterCardStyle = {
        border: '1px solid #ddd',
        padding: '50px',
        borderRadius: '8px',
        textAlign: 'center',
        backgroundImage: 'url(" https://t4.ftcdn.net/jpg/01/68/49/67/240_F_168496711_iFQUk2vqAnnDpVzGm2mtp8u2gqgwZrY7.jpg")',
    };


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
            <Layout>
                <div style={gridContainerStyle}>
                    <h2> Your monster:</h2>
                    <div key={monster.id} style={monsterCardStyle} className="card">
                        <p style={{ background: "white", margin: '5px' }}> {monster.name}</p>
                        <Flex>
                            <Card card={monster} />
                        </Flex>
                    </div>
                    <div>
                        points: {monster.copy} / energy: {energy}
                        {monster.up_points < 30 ? (
                            <p>boost up: {monster.up_points} / 30
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
                                        <span> (- {monster.up_points * 100} energy )</span>
                                    </>
                                }
                            </p>) : (
                            <p>
                                Up Max!
                            </p>
                        )
                        }
                        {monster.right_points < 30 ? (
                            <p>boost right: {monster.right_points} / 30
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
                                        <span> (- {monster.right_points * 100} energy )</span>
                                    </>
                                }
                            </p>
                        ) : (
                            <p>
                                Right Max!
                            </p>
                        )
                        }
                        {monster.down_points < 30 ? (
                            <p>boost down: {monster.down_points} / 30
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
                                        <span> (- {monster.down_points * 100} energy )</span>
                                    </>
                                }
                            </p>
                        ) : (
                            <p>
                                Down Max!
                            </p>
                        )
                        }
                        {monster.left_points < 30 ? (
                            <p>boost left: {monster.left_points} / 30
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
                                        <span> (- {monster.left_points * 100} energy )</span>
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

            </Layout>
        </>
    )
}

export default monster