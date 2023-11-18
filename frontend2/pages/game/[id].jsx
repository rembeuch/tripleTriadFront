import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Flex, Text } from '@chakra-ui/react';

import { useAccount, useProvider, useSigner } from 'wagmi'
import Layout from '@/components/Layout/Layout';
import Card from '@/components/Card';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'


const Game = () => {
    const router = useRouter();
    const { id } = router.query;
    const [selectedCard, setSelectedCard] = useState(null);
    const [board, setBoard] = useState(Array(9).fill(false));
    const [leftCards, setLeftCards] = useState([]);
    const [rightCards, setRightCards] = useState([]);
    const [game, setGame] = useState(null);
    const [addAlert, setAddAlert] = useState("");
    const [turn, setTurn] = useState(true);


    const { address, isConnected } = useAccount()

    async function getGame() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find_game?address=${address}`}`);
        return response.json();
    }

    async function getDeck() {
        const response = await fetch(`${`http://localhost:3000/api/v1/deck_in_game?address=${address}`}`);
        return response.json();
    }

    async function getComputerDeck() {
        const response = await fetch(`${`http://localhost:3000/api/v1/computer_deck?address=${address}`}`);
        return response.json();
    }

    async function getBoardPosition() {
        const response = await fetch(`${`http://localhost:3000/api/v1/board_position?address=${address}`}`);
        return response.json();
    }

    async function updatePosition(card_id, position) {
        setTurn(false)
        const response = await fetch(`${`http://localhost:3000/api/v1/update_position?address=${address}&card_id=${card_id}&position=${position}`}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const updateBoard = async () => {
            try {
                const json = await getBoardPosition();
                setBoard(json);
            } catch (error) {
                console.error("Failed to update board", error);
            }
        };
        updateBoard();
        const fetchComputerDeck = async () => {
            try {
                const json = await getComputerDeck();
                setRightCards(json);
            } catch (error) {
                console.error("Failed to fetch the computer deck: ", error);
            }
        };
        fetchComputerDeck();

        if (response.ok) {
            const responseData = await response.json();
            setAddAlert(responseData.message);
            setTimeout(() => {
                setAddAlert("")
            }, 3000);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));

        const computerResponse = await fetch(`${`http://localhost:3000/api/v1/update_computer_position?address=${address}`}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        updateBoard();


        fetchComputerDeck();

        if (computerResponse.ok) {
            const responseComputer = await computerResponse.json();
            setAddAlert(responseComputer.message);
            setTimeout(() => {
                setAddAlert("")
            }, 3000);
        }
        setTurn(true)
    }

    async function quitGame() {
        const response = await fetch(`${`http://localhost:3000/api/v1/quit_game?address=${address}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const responseData = await response.json();
            const playerId = responseData.id;
            router.push(`/`)
        }
    }


    useEffect(() => {
        let mounted = true;
        getGame().then((item) => {
            if (mounted) {
                setGame(item);
            }
        });
        return () => (mounted = false);
    }, [address]);

    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const json = await getDeck();
                setLeftCards(json);
            } catch (error) {
                console.error("Failed to fetch the player deck: ", error);
            }
        };
        fetchDeck();
    }, []);


    useEffect(() => {
        const fetchComputerDeck = async () => {
            try {
                const json = await getComputerDeck();
                setRightCards(json);
            } catch (error) {
                console.error("Failed to fetch the computer deck: ", error);
            }
        };
        fetchComputerDeck();
    }, []);

    useEffect(() => {
        const updateBoard = async () => {
            try {
                const json = await getBoardPosition();
                setBoard(json);
            } catch (error) {
                console.error("Failed to update board", error);
            }
        };
        updateBoard();
    }, []);

    const handleCardClick = (card) => {
        if (turn) {
            setSelectedCard(card);
        }
    };

    const handleTileClick = (index) => {
        if (turn) {
            if (selectedCard !== null && board[index] === false) {
                const updatedBoard = [...board];
                updatedBoard[index] = selectedCard;
                setBoard(updatedBoard);
                setSelectedCard(null);
                updatePosition(selectedCard.id, index)
                // Retirer la carte utilisée du côté correspondant
                const updatedLeftCards = leftCards.filter((card) => card.id !== selectedCard.id)
                setLeftCards(updatedLeftCards);
            }
        }
    };



    const gameStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const cardStyle = {
        backgroundColor: '#f1f1f1',
        border: '1px solid #ddd',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        cursor: 'pointer',
    };

    const selectedCardStyle = {
        ...cardStyle,
        backgroundColor: '#ffcc00',
        transform: 'scale(1.1)',
        marginRight: "25px",
    };

    const leftCardStyle = {
        ...cardStyle,
        marginRight: "25px",
        backgroundColor: '#87CEEB',

    };
    const rightCardStyle = {
        ...cardStyle,
        marginLeft: "15px",
        backgroundColor: '#FFC0CB',

    };
    const playerCardStyle = (card) => ({
        backgroundColor: card.computer ? '#FFC0CB' : '#87CEEB',
        width: '220px',
        height: '220px',
        border: '1px solid #aaa',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        cursor: 'pointer',
    });

    const tyleCardStyle = {
        backgroundColor: 'grey',
        width: '220px',
        height: '220px',
        border: '1px solid #aaa',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        cursor: 'pointer',
    }

    if (!game) return <h2>Loading...</h2>;
    if (!leftCards) return <h2>Loading...</h2>;
    if (!board) return <h2>Loading...</h2>;


    return (
        <>
            {isConnected ? (
                <>
                    {game.id == id ?
                        (<>
                            < div style={gameStyle} >
                                <div className="cards left-cards">
                                    {leftCards.map((card) => (
                                        <div
                                            key={card.id}
                                            style={selectedCard === card ? selectedCardStyle : leftCardStyle}
                                            onClick={() => handleCardClick(card)}
                                        >
                                            <Card card={card} />
                                        </div>
                                    ))}
                                </div>
                                <div className="game-board" style={{ padding: '10px' }}>
                                    {addAlert != "" && <div>
                                        <Alert status='warning' width="100%">
                                            <AlertIcon />
                                            {addAlert}!
                                        </Alert>
                                    </div>
                                    }

                                    <div style={{ display: 'flex' }}>

                                        {board.slice(0, 3).map((card, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleTileClick(index)}
                                                style={card ? playerCardStyle(card) : tyleCardStyle}
                                            >
                                                {card !== false ? <Card card={card} /> : ""}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        {board.slice(3, 6).map((card, index) => (
                                            <div
                                                key={index + 3}
                                                onClick={() => handleTileClick(index + 3)}
                                                style={card ? playerCardStyle(card) : tyleCardStyle}
                                            >
                                                {card !== false ? <Card card={card} /> : ''}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        {board.slice(6, 9).map((card, index) => (
                                            <div
                                                key={index + 6}
                                                onClick={() => handleTileClick(index + 6)}
                                                style={card ? playerCardStyle(card) : tyleCardStyle}
                                            >
                                                {card !== false ? <Card card={card} /> : ''}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="cards right-cards">
                                    {rightCards.map((card) => (
                                        <div
                                            key={card.id}
                                            style={rightCardStyle}
                                        >
                                            <Card card={card} />
                                        </div>
                                    ))}
                                </div>
                            </div >
                            <div>
                                <button onClick={() => quitGame()} style={{
                                    color: "#F9DC5C",
                                    backgroundColor: "red",
                                    padding: "10px 50px",
                                    margin: 10,
                                    transition: "background-color 0.3s ease",
                                    borderRadius: 5,
                                    textDecoration: "none"
                                }} > Quit Game </button>
                            </div>
                        </>
                        )
                        : (
                            <div>
                                <p> "Not your game!"</p>
                                <Link href="/">Back</Link>
                            </div>
                        )}
                </>
            ) : (
                <Alert status='warning' width="50%">
                    <AlertIcon />
                    Please, connect your Wallet!
                </Alert>
            )}
        </>
    );
};

export default Game;
