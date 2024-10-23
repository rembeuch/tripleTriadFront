import Layout from '@/components/Layout/Layout';
import {
    Alert,
    AlertIcon,
    Box,
    HStack,
    VStack,
    Text,
    Button,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/authContext';
import ZoneBackground from "@/components/ZoneBackground";
import CosmosBackground from "@/components/CosmosBackground";

export default function Stats() {
    const [player, setPlayer] = useState(null);
    const [pnjs, setPnjs] = useState(null);
    const [zones, setZones] = useState(null);
    const [currentPnjIndex, setCurrentPnjIndex] = useState(0);
    const [zoneMonsters, setZoneMonsters] = useState(null);
    const { authToken } = useAuth();

    async function getPlayer() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_player?token=${authToken}`);
        return response.json();
    }

    async function getPnjs() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_all_pnjs?player_id=${player.id}`);
        return response.json();
    }

    async function getZoneMonsters() {
        const response = await fetch(`${`${process.env.NEXT_PUBLIC_API_URL}/api/v1/find_zone_monsters?player_id=${player.id}&position=${pnjs[currentPnjIndex].zone}`}`);
        return response.json();
    }

    useEffect(() => {
        const fetchCurrentPlayer = async () => {
            try {
                if (!authToken) return;
                const json = await getPlayer();
                setPlayer(json);
            } catch (error) {
                console.error("Failed to fetch the player: ", error);
            }
        };
        fetchCurrentPlayer();
    }, [authToken]);

    useEffect(() => {
        const fetchCurrentPnjs = async () => {
            if (!player) return;
            try {
                const json = await getPnjs();
                setPnjs(json.pnjs);
                setZones(json.zones);
            } catch (error) {
                console.error("Failed to fetch PNJs: ", error);
            }
        };
        fetchCurrentPnjs();
    }, [player]);

    useEffect(() => {
        if (!pnjs) return;

        const fetchZoneMonsters = async () => {
            try {
                const json = await getZoneMonsters();
                setZoneMonsters(json.monsters);
            } catch (error) {
                console.error("Failed to fetch the monsters: ", error);
            }
        };

        fetchZoneMonsters();
    }, [pnjs, currentPnjIndex]);

    const goToNextPnj = () => {
        setCurrentPnjIndex((prevIndex) => (prevIndex + 1) % pnjs.length);
    };

    const goToPreviousPnj = () => {
        setCurrentPnjIndex((prevIndex) => (prevIndex - 1 + pnjs.length) % pnjs.length);
    };

    if (!player) return <h2>Loading...</h2>;
    if (!pnjs) return <h2>Loading PNJs...</h2>;

    return (
        <CosmosBackground>
            <ZoneBackground zonePnj={pnjs[currentPnjIndex]}>
                <Layout>
            {player &&
                <Link href="/player/[id]" as={`/player/${player.id}`}>
                    Back
                </Link>
            }
                    {Array.isArray(pnjs) && pnjs.length > 0 ? (
                        <Box
                            bg="rgba(50, 50, 50, 0.9)"  // Fond similaire avec opacité
                            borderRadius="20px"
                            boxShadow="0 4px 8px rgba(0, 0, 0, 0.5)"
                            padding="20px"
                            margin="20px"
                            maxWidth="600px"
                            height="auto"  // Hauteur automatique pour s'ajuster au contenu
                            width="400px"  // Largeur augmentée
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                        >
                            {/* Conteneur flex pour l'image et le texte */}
                            <Box display="flex" flexDirection="column" alignItems="center" flexGrow={1}>
                                {/* Ajout de l'image, comme dans l'exemple */}
                                <img
                                    src={pnjs[currentPnjIndex].dialogue.images[0]}
                                    alt="PNJ Avatar"
                                    style={{ width: '200px', height: '200px' }}  // Taille de l'image
                                />

                                <Text
                                    color="white"
                                    textAlign="center"
                                    marginBottom="20px"
                                    overflowY="auto"  // Défilement si texte trop long
                                    flexGrow={1}  // Permet au texte de prendre l'espace restant
                                >
                                    {zones[currentPnjIndex] ? <>{zones[currentPnjIndex]} <br /></> : <>Sanctuary<br /></>}
                                    {pnjs[currentPnjIndex].try ? <>Try: {pnjs[currentPnjIndex].try} <br /></> : null}
                                    {pnjs[currentPnjIndex].victory ? <>Victory: {pnjs[currentPnjIndex].victory} <br /></> : null}
                                    {pnjs[currentPnjIndex].defeat ? <>Defeat: {pnjs[currentPnjIndex].defeat} <br /></> : null}
                                    {pnjs[currentPnjIndex].perfect ? <>Perfect: {pnjs[currentPnjIndex].perfect} <br /></> : null}
                                    {pnjs[currentPnjIndex].boss ? <>Boss: {pnjs[currentPnjIndex].boss} <br /></> : null}
                                    {pnjs[currentPnjIndex].awake ? <>Awaken Spirit: {pnjs[currentPnjIndex].awake} <br /></> : null}
                                    {zoneMonsters ? <>Spirits: {zoneMonsters} <br /></> : null}

                                </Text>
                            </Box>

                            {/* Boutons de navigation */}
                            <Box display="flex" justifyContent="center" alignItems="center">
                                {currentPnjIndex > 0 && (
                                    <Button
                                        onClick={goToPreviousPnj}
                                        marginRight="10px"
                                        bg="gray.700"
                                        color="white"
                                        _hover={{ bg: "gray.600" }}
                                        _disabled={{ bg: "gray.500", cursor: "not-allowed" }}
                                    >
                                        ◀
                                    </Button>
                                )}

                                {currentPnjIndex < pnjs.length - 1 && (
                                    <Button
                                        onClick={goToNextPnj}
                                        marginLeft="10px"
                                        bg="gray.700"
                                        color="white"
                                        _hover={{ bg: "gray.600" }}
                                        _disabled={{ bg: "gray.500", cursor: "not-allowed" }}
                                    >
                                        ▶
                                    </Button>
                                )}
                            </Box>
                        </Box>



                    ) : (
                        <Alert status="warning" width="50%" mx="auto">
                            <AlertIcon />
                            Please, login or create an account
                        </Alert>
                    )}
                </Layout>
            </ZoneBackground>
        </CosmosBackground>
    );
}
