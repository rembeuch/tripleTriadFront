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

const elite = () => {
    const { authToken } = useAuth();
    const { address, isConnected } = useAccount()
    const router = useRouter();
    const { id } = router.query;
    const [player, setPlayer] = useState(null);
    const [elite, setElite] = useState();
    const [powers, setPowers] = useState([]);
    const [ability, setAbility] = useState();


    async function getPlayer() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find?token=${authToken}`}`);
        return response.json();
    }

    async function getElite() {
        const response = await fetch(`${`http://localhost:3000/api/v1/elites/${id}?token=${authToken}`}`);
        return response.json();
    }

    async function playerAbility(power) {

        const response = await fetch(`${`http://localhost:3000/api/v1/ability?token=${authToken}&power=${power}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        setAbility(power)
    }

    useEffect(() => {

        const fetchCurrentPlayer = async () => {
            try {
                const json = await getPlayer();
                setPlayer(json);
                setAbility(json.ability)
            } catch (error) {
                console.error("Failed to fetch the player: ", error);
            }
        };
        fetchCurrentPlayer();
    }, [address, authToken]);

    useEffect(() => {
        const fetchCurrentElite = async () => {
            try {
                const json = await getElite();
                setElite(json.elite);
                setPowers(json.power);
            } catch (error) {
                setElite(null);
                console.error("Failed to fetch the elite: ", error);
            }
        };
        if (player) {
            fetchCurrentElite();
        }
    }, [address, authToken, player]);

    const eliteCardStyle = {
        border: '1px solid #ddd',
        padding: '20px',
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
    if (!elite) return <h2>Loading...</h2>;

    return (
        <>
            <Layout>
                <div style={gridContainerStyle}>
                    <h2> Your Elite:</h2>
                    <div key={elite.id} style={eliteCardStyle} className="card">
                        <p style={{ background: "white", margin: '5px' }}> Elite #{elite.name}</p>
                        <Flex>
                            <Card card={elite} />
                        </Flex>
                    </div>
                    <div>
                        <p>Fight: {elite.fight}</p>
                        <p>Diplomacy: {elite.diplomacy}</p>
                        <p>Espionage: {elite.espionage}</p>
                        <p>Leadership: {elite.leadership}</p>
                    </div>
                </div>
                <h2> Powers: {ability && `Actual power: ${ability}`} </h2>
                <div style={gridContainerStyle}>
                    {powers.map(power => (
                        <>
                            <div key={power.index} onClick={() => playerAbility(power)} className="card">
                                <button style={{
                                    color: "#F9DC5C",
                                    backgroundColor: "green",
                                    padding: "10px 50px",
                                    margin: 10,
                                    transition: "background-color 0.3s ease",
                                    borderRadius: 5,
                                    textDecoration: "none"
                                }} > {power} </button>
                            </div>
                        </>
                    ))}
                </div>
            </Layout>
        </>
    )
}

export default elite