import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import { contractAddress, abi } from '@/public/constants';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Flex,
} from '@chakra-ui/react'
import Layout from '@/components/Layout/Layout';
import Card from '@/components/Card';
import PowerModal from '@/components/PowerModal';
import { useAuth } from '@/contexts/authContext';
import { BigNumber } from 'ethers';

const elite = () => {
    const { authToken } = useAuth();
    const { address, isConnected } = useAccount()
    const router = useRouter();
    const { id } = router.query;
    const [player, setPlayer] = useState(null);
    const [elite, setElite] = useState();
    const [powers, setPowers] = useState([]);
    const [ability, setAbility] = useState();
    const { data: signer } = useSigner();
    const [nftList, setNftList] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredPower, setHoveredPower] = useState(null);


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

    async function increment(stat) {
        const response = await fetch(`${`http://localhost:3000/api/v1/increment_elite?token=${authToken}&stat=${stat}&id=${elite.id}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const responseData = await response.json();
            setElite(responseData.elite)
            setPowers(responseData.power)
            setPlayer(responseData.player)
        }
    }

    async function mintElite(id, value = 0.01) {
        if (isConnected) {
            const contract = new ethers.Contract(contractAddress, abi, signer)

            const valueInWei = ethers.utils.parseEther(value.toString());
            await contract.mintElite(id, { value: valueInWei });
        }
    }

    async function checkNftElite(id) {
        const response = await fetch(`${`http://localhost:3000/api/v1/nft_elite?token=${authToken}&id=${id}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const responseData = await response.json();
            setElite(responseData.elite)
        }
    }

    async function fetchNfts() {
        if (isConnected) {
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const nfts = await contract.getMyNFTs();

            setNftList(nfts);
            nftList.map(nft => {
                const eliteIdBigNumber = BigNumber.from(nft.eliteId);

                // Utilisez toNumber pour obtenir la valeur numérique
                const eliteId = eliteIdBigNumber.toNumber();
                checkNftElite(eliteId)
                return null;
            });
        }
    }

    const handleMouseEnter = (power) => {
        setIsHovered(true);
        setHoveredPower(power);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setHoveredPower(null);
    };

    useEffect(() => {
        const fetchNFT = async () => {
            await fetchNfts();
        };
        if (isConnected && signer && !elite.nft) {
            fetchNFT()
        }
    }, [authToken, player, elite]);


    useEffect(() => {

        const fetchCurrentPlayer = async () => {
            const json = await getPlayer();
            setPlayer(json);
            setAbility(json.ability)
        };
        if (authToken) {
            fetchCurrentPlayer();
        }
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
        height: '220px',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        backgroundImage: 'url(" https://t4.ftcdn.net/jpg/01/68/49/67/240_F_168496711_iFQUk2vqAnnDpVzGm2mtp8u2gqgwZrY7.jpg")',
    };

    const buttonStyle = {
        position: 'relative',
        display: 'inline-block',
        color: "#F9DC5C",
        backgroundColor: "grey",
        padding: "10px 50px",
        margin: 10,
        transition: "background-color 0.3s ease",
        borderRadius: 5,
        display: 'block',
        textDecoration: "none",
        backgroundColor: 'green'
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
                <div>
                    <h2> Your Elite:</h2>
                    {player && elite && isConnected ?
                        (
                            <div>
                                {elite.nft == false &&
                                    <>
                                        <h2>Mint Elite</h2>
                                        <button onClick={() => mintElite()}>Mint</button>
                                    </>
                                }
                            </div>
                        )
                        :
                        (
                            <div>
                                {elite.nft == false &&
                                    <>
                                        <h2>Mint Elite</h2>
                                        <ConnectButton />
                                    </>
                                }
                            </div>
                        )
                    }
                    <div style={eliteCardStyle} className="card">
                        <p style={{ background: "white", margin: '5px' }}> {elite.name}
                            {elite.nft && '//NFT'}
                        </p>
                        <Flex>
                            <Card card={elite} />
                        </Flex>
                    </div>
                    <div>
                        points: {player.elite_points} / energy: {player.energy}
                        {elite.fight < 100 ? (
                            <p>Fight (up): {elite.fight} / 100
                                {player.elite_points > 0 &&
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
                                        {elite.nft ? (
                                            <span> (- {elite.fight * 5} energy )</span>
                                        ) : (
                                            <span> (- {elite.fight * 10} energy )</span>
                                        )}
                                    </>
                                }
                            </p>) : (
                            <p>
                                Fight Max!
                            </p>
                        )
                        }
                        {elite.diplomacy < 100 ? (
                            <p>Diplomacy (right): {elite.diplomacy} / 100
                                {player.elite_points > 0 &&
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
                                        {elite.nft ? (
                                            <span> (- {elite.diplomacy * 5} energy )</span>
                                        ) : (
                                            <span> (- {elite.diplomacy * 10} energy )</span>
                                        )}                                    </>
                                }
                            </p>) : (
                            <p>
                                Diplomacy Max!
                            </p>
                        )
                        }
                        {elite.espionage < 100 ? (
                            <p>Espionage (down): {elite.espionage} / 100
                                {player.elite_points > 0 &&
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
                                        {elite.nft ? (
                                            <span> (- {elite.espionage * 5} energy )</span>
                                        ) : (
                                            <span> (- {elite.espionage * 10} energy )</span>
                                        )}                                    </>
                                }
                            </p>) : (
                            <p>
                                Espionage Max!
                            </p>
                        )
                        }
                        {elite.leadership < 100 ? (
                            <p>Leadership (left): {elite.leadership} / 100
                                {player.elite_points > 0 &&
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
                                        {elite.nft ? (
                                            <span> (- {elite.leadership * 5} energy )</span>
                                        ) : (
                                            <span> (- {elite.leadership * 10} energy )</span>
                                        )}                                    </>
                                }
                            </p>) : (
                            <p>
                                Leadership Max!
                            </p>
                        )
                        }
                    </div>
                </div>
                <h2>{ability && `Current power: ${ability}`} </h2>

                <div className="button-column" style={{
                    display: "flex"
                }}>
                    {/* Première colonne */}
                    <div className="column" style={{
                        flexDirection: "column"
                    }}>
                        {powers.filter(power => power[0] === "f").length > 0 ? (
                            <>
                                {powers.filter(power => power[0] === "f").map(power => (
                                    <>
                                        <div key={powers.index} onClick={() => playerAbility(power)} className="card" >
                                            <button className="button" style={buttonStyle} onMouseEnter={() => handleMouseEnter(power)} onMouseLeave={() => handleMouseLeave(power)}>
                                                {power}
                                            </button>
                                            {hoveredPower === power && 
                                                    <PowerModal power={power} isHovered={isHovered} />
                                            }
                                        </div >
                                    </>
                                ))}
                            </>)
                            :
                            (< div className="card">
                                <button style={{
                                    color: "#F9DC5C",
                                    backgroundColor: "grey",
                                    padding: "10px 50px",
                                    margin: 10,
                                    transition: "background-color 0.3s ease",
                                    borderRadius: 5,
                                    display: 'block',
                                    textDecoration: "none"
                                }} > fight1 </button>
                            </div >
                            )}
                    </div>
                    {/* Deuxième colonne */}
                    <div className="column" style={{
                        flexDirection: "column"
                    }}>
                        {powers.filter(power => power[0] === "d").length > 0 ? (
                            <>
                                {powers.filter(power => power[0] === "d").map(power => (

                                    < div key={powers.index} onClick={() => playerAbility(power)} className="card">
                                        <button style={{
                                            color: "#F9DC5C",
                                            backgroundColor: "green",
                                            padding: "10px 50px",
                                            margin: 10,
                                            transition: "background-color 0.3s ease",
                                            borderRadius: 5,
                                            display: 'block',
                                            textDecoration: "none"
                                        }} > {power} </button>
                                    </div >
                                ))}
                            </>)
                            :
                            (< div className="card">
                                <button style={{
                                    color: "#F9DC5C",
                                    backgroundColor: "grey",
                                    padding: "10px 50px",
                                    margin: 10,
                                    transition: "background-color 0.3s ease",
                                    borderRadius: 5,
                                    display: 'block',
                                    textDecoration: "none"
                                }} > diplomacy1 </button>
                            </div >
                            )}
                    </div>
                    {/* Troisième colonne */}
                    <div className="column" style={{
                        flexDirection: "column"
                    }}>
                        {powers.filter(power => power[0] === "e").length > 0 ? (
                            <>
                                {powers.filter(power => power[0] === "e").map(power => (

                                    < div key={powers.index} onClick={() => playerAbility(power)} className="card">
                                        <button style={{
                                            color: "#F9DC5C",
                                            backgroundColor: "green",
                                            padding: "10px 50px",
                                            margin: 10,
                                            transition: "background-color 0.3s ease",
                                            borderRadius: 5,
                                            display: 'block',
                                            textDecoration: "none"
                                        }} > {power} </button>
                                    </div >
                                ))}
                            </>)
                            :
                            (< div className="card">
                                <button style={{
                                    color: "#F9DC5C",
                                    backgroundColor: "grey",
                                    padding: "10px 50px",
                                    margin: 10,
                                    transition: "background-color 0.3s ease",
                                    borderRadius: 5,
                                    display: 'block',
                                    textDecoration: "none"
                                }} > espionage1 </button>
                            </div >
                            )}
                    </div>
                    {/* Quatrième colonne */}
                    <div className="column" style={{
                        flexDirection: "column"
                    }}>
                        {powers.filter(power => power[0] === "l").length > 0 ? (
                            <>
                                {powers.filter(power => power[0] === "l").map(power => (

                                    < div key={powers.index} onClick={() => playerAbility(power)} className="card">
                                        <button style={{
                                            color: "#F9DC5C",
                                            backgroundColor: "green",
                                            padding: "10px 50px",
                                            margin: 10,
                                            transition: "background-color 0.3s ease",
                                            borderRadius: 5,
                                            display: 'block',
                                            textDecoration: "none"
                                        }} > {power} </button>
                                    </div >
                                ))}
                            </>)
                            :
                            (< div className="card">
                                <button style={{
                                    color: "#F9DC5C",
                                    backgroundColor: "grey",
                                    padding: "10px 50px",
                                    margin: 10,
                                    transition: "background-color 0.3s ease",
                                    borderRadius: 5,
                                    display: 'block',
                                    textDecoration: "none"
                                }} > leadership1 </button>
                            </div >
                            )}
                    </div>
                </div>
            </Layout >
        </>
    )
}

export default elite