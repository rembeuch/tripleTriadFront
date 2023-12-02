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
import { useAuth } from '@/contexts/authContext';



const Game = () => {
    const { authToken } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [player, setPlayer] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [board, setBoard] = useState(Array(9).fill(false));
    const [leftCards, setLeftCards] = useState([]);
    const [rightCards, setRightCards] = useState([]);
    const [game, setGame] = useState(null);
    const [addAlert, setAddAlert] = useState('');
    const [turn, setTurn] = useState(true);
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [playerPowerPoints, setPlayerPowerPoints] = useState(0);
    const [playerPower, setPlayerPower] = useState(false);
    const [playerComputerPowerPoints, setPlayerComputerPowerPoints] = useState(0);
    const [playerComputerPower, setPlayerComputerPower] = useState(false);
    const [endgame, setEndgame] = useState(false);
    const [endAlert, setEndAlert] = useState('');
    const [next, setNext] = useState(false);



    const { address, } = useAccount()

    async function getPlayer() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find?address=${address}&token=${authToken}`}`);
        return response.json();
    }

    async function getGame() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find_game?address=${address}&token=${authToken}`}`);
        return response.json();
    }

    async function fetchPlayerDeck() {
        try {
            const response = await fetch(`${`http://localhost:3000/api/v1/deck_in_game?address=${address}&token=${authToken}`}`);
            const json = await response.json();
            setLeftCards(json);
        } catch (error) {
            console.error("Failed to fetch the computer deck: ", error);
        }
    };

    async function fetchComputerDeck() {
        try {
            const response = await fetch(`${`http://localhost:3000/api/v1/computer_deck?address=${address}&token=${authToken}`}`);
            const json = await response.json();
            setRightCards(json);
        } catch (error) {
            console.error("Failed to fetch the computer deck: ", error);
        }
    };

    async function updateBoard() {
        try {
            const response = await fetch(`${`http://localhost:3000/api/v1/board_position?address=${address}&token=${authToken}`}`);
            const json = await response.json();
            setBoard(json);
        } catch (error) {
            console.error("Failed to update board", error);
        }
    };

    async function getScore() {
        const response = await fetch(`${`http://localhost:3000/api/v1/get_score?address=${address}&token=${authToken}`}`);
        if (response.ok) {
            const responseScore = await response.json();
            setPlayerScore(responseScore.player_score)
            setComputerScore(responseScore.computer_score)
            setPlayerPowerPoints(responseScore.player_power_points)
            setPlayerPower(responseScore.player_power)
            setPlayerComputerPowerPoints(responseScore.player_computer_power_points)
            setPlayerComputerPower(responseScore.player_computer_power)
        }
    }

    async function win() {
        const response = await fetch(`${`http://localhost:3000/api/v1/win?address=${address}&token=${authToken}`}`)
        const responseWin = await response.json();
        setEndAlert(responseWin.message)
        if (responseWin.message != "") {
            setTimeout(() => {
                setEndgame(true);
            }, 3000);
        }

    }

    async function review() {
        setEndgame(false);
        setNext(true)
    }


    async function updatePosition(card_id, position) {
        setTurn(false)
        const response = await fetch(`${`http://localhost:3000/api/v1/update_position?address=${address}&token=${authToken}&card_id=${card_id}&position=${position}`}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        updateBoard();
        fetchComputerDeck();

        if (response.ok) {
            const responseData = await response.json();
            setAddAlert(responseData.message);
            if (responseData.message != '') {
                if (responseData.cards_updated != []) {

                    responseData.cards_updated.forEach((card_id) => {
                        const processUpdatedCards = async (card_id) => {
                            const responseCombo = await fetch(`${`http://localhost:3000/api/v1/player_combo?address=${address}&token=${authToken}&card_id=${card_id}`}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });
                            if (responseCombo.ok) {
                                const combo = await responseCombo.json();
                                setAddAlert(combo.message);

                                updateBoard();
                                fetchComputerDeck();
                            }
                        }
                        processUpdatedCards(card_id)
                    });
                }
                setTimeout(() => {
                    setAddAlert("");
                }, 3000);
            }
        }
        await getScore()

        const computerResponse = await fetch(`${`http://localhost:3000/api/v1/update_computer_position?address=${address}&token=${authToken}`}`, {
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
            if (responseComputer.message != "") {
                if (responseComputer.cards_updated != []) {
                    responseComputer.cards_updated.forEach((card_id) => {

                        const processUpdatedCards = async (card_id) => {

                            const responseCombo = await fetch(`${`http://localhost:3000/api/v1/computer_combo?address=${address}&token=${authToken}&card_id=${card_id}`}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });
                            const combo = await responseCombo.json();
                            setAddAlert(combo.message);
                            updateBoard();
                            fetchComputerDeck();
                        }
                        processUpdatedCards(card_id)
                    });
                }
                setTimeout(() => {
                    setAddAlert("")
                }, 3000);
            }
        }
        await getScore()
        await win()
        setTurn(true)
    }

    async function nextGame() {
        const response = await fetch(`${`http://localhost:3000/api/v1/next_game?address=${address}&token=${authToken}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const responseData = await response.json();
            if (responseData.id == game.id) {
                setEndgame(false)
                await updateBoard();
                await fetchComputerDeck();
                await fetchPlayerDeck()
                setEndAlert('')
                setNext(false)
            } else {
                router.push('/');
            }
        }
    }

    async function quitGame() {
        const response = await fetch(`${`http://localhost:3000/api/v1/quit_game?address=${address}&token=${authToken}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        router.push('/');
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

    useEffect(() => {
        const fetchCurrentGame = async () => {
            try {
                const json = await getGame();
                setGame(json);
            } catch (error) {
                setGame(null);
                console.error("Failed to fetch the game: ", error);
            }
        };

        if (player) {
            fetchCurrentGame();
        }
    }, [address, authToken, player, endgame]);

    useEffect(() => {
        if (player) {
            getScore()
        }
    }, [address, endgame]);



    useEffect(() => {
        if (player) {
            setBoard(board)
            if (board.every(element => element !== false)) {
                setTimeout(() => {
                    setNext(true);
                }, 3900);

            } else {
                setNext(false);
            }
        }
    }, [board, next]);

    useEffect(() => {
        if (player) {
            fetchPlayerDeck();
        }
    }, [address, authToken, player]);


    useEffect(() => {
        if (player) {
            fetchComputerDeck();
        }
    }, [address, authToken, player]);

    useEffect(() => {
        if (player) {
            updateBoard();
        }
    }, [address, authToken, player]);

    useEffect(() => {
        if (player) {
            getScore();
        }
    }, [playerScore, computerScore, authToken, player]);

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
        justifyContent: 'center',
        alignItems: 'center',
    };

    const cardStyle = {
        backgroundColor: '#f1f1f1',
        border: '1px solid #ddd',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        cursor: 'pointer',
        display: 'flex',
        flexWrap: "wrap",
        margin: "10px",
        padding: "10px"
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
        transition: 'background-color 0.5s ease',
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
    if (!player) return <h2>Loading...</h2>;
    if (!leftCards) return <h2>Loading...</h2>;
    if (!board) return <h2>Loading...</h2>;

    return (
        <>
            {player ? (
                <>
                    {game.id == id ?
                        (<>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <p>{player.name} rounds: {game.player_points} </p>
                                <p>rounds to win: {game.rounds}</p>
                                <p>rounds: {game.computer_points} The Machine </p>
                            </div>
                            {endgame ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                        <p>Score: {playerScore}</p>
                                        {endAlert != "" && <div>
                                            <Alert status='warning' width="100%">
                                                <AlertIcon />
                                                {endAlert}!
                                            </Alert>
                                        </div>
                                        }
                                        <button onClick={() => review()} style={{
                                            color: "#F9DC5C",
                                            backgroundColor: "blue",
                                            padding: "10px 50px",
                                            margin: 10,
                                            transition: "background-color 0.3s ease",
                                            borderRadius: 5,
                                            textDecoration: "none"
                                        }} > Review Board </button>
                                        <p>Score: {computerScore}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    < div style={gameStyle} >
                                        <div className="left-cards">
                                            {leftCards.map((card) => (
                                                <div
                                                    key={card.id}
                                                    style={selectedCard === card ? selectedCardStyle : leftCardStyle}
                                                    onClick={() => handleCardClick(card)}
                                                >
                                                    Matricule #{card.name}:
                                                    <Card card={card} />
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                {playerPower ? (<p>🔥</p>) : (<p></p>) }                                             
                                                {playerComputerPower ? (<p>🔥</p>) : (<p></p>)}
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ position: 'relative', width: '200px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            color: '#555',
                                                        }}
                                                    >
                                                        Power
                                                    </div>

                                                    <div
                                                        style={{
                                                            width: '100%',
                                                            height: '20px',
                                                            background: 'linear-gradient(to right, green, yellow, red)',
                                                            transition: 'width 0.3s ease',
                                                            position: 'relative',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: `${(playerPowerPoints / 10) * 100}%`,
                                                                transform: 'translateX(-50%)',
                                                                width: '10px',
                                                                height: '100%',
                                                                backgroundColor: 'transparent',
                                                                zIndex: 1,
                                                            }}
                                                        />
                                                        {[...Array(10)].map((_, index) => (
                                                            playerPowerPoints === index + 1 && (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '50%',
                                                                        left: `${(index + 1) * 10}%`,
                                                                        transform: 'translate(-50%, -50%)',
                                                                        color: '#555',
                                                                    }}
                                                                >
                                                                    {index + 1}
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>


                                                <div>
                                                    Score: {playerScore}
                                                    {addAlert !== "" && (
                                                        <div>
                                                            <Alert status='warning' width="100%">
                                                                <AlertIcon />
                                                                {addAlert}!
                                                            </Alert>
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', marginLeft: 'auto' }}>
                                                    <p>Score: {computerScore}</p>

                                                    <div style={{ position: 'relative', width: '200px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                top: '50%',
                                                                left: '50%',
                                                                transform: 'translate(-50%, -50%)',
                                                                color: '#555',
                                                            }}
                                                        >
                                                            Power
                                                        </div>

                                                        <div
                                                            style={{
                                                                width: '100%',
                                                                height: '20px',
                                                                background: 'linear-gradient(to right, green, yellow, red)',
                                                                transition: 'width 0.3s ease',
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: `${(playerComputerPowerPoints / 10) * 100}%`,
                                                                    transform: 'translateX(-50%)',
                                                                    width: '10px',
                                                                    height: '100%',
                                                                    backgroundColor: 'transparent',
                                                                    zIndex: 1,
                                                                }}
                                                            />
                                                            {[...Array(10)].map((_, index) => (
                                                                playerComputerPowerPoints === index + 1 && (
                                                                    <div
                                                                        key={index}
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '50%',
                                                                            left: `${(index + 1) * 10}%`,
                                                                            transform: 'translate(-50%, -50%)',
                                                                            color: '#555',
                                                                        }}
                                                                    >
                                                                        {index + 1}
                                                                    </div>
                                                                )
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <div style={{ display: 'flex' }}>

                                                {board.slice(0, 3).map((card, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleTileClick(index)}
                                                        style={card ? playerCardStyle(card) : tyleCardStyle}
                                                    >
                                                        {card !== false ? <Card card={card} played={true} /> : ""}
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
                                                        {card !== false ? <Card card={card} played={true} /> : ''}
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
                                                        {card !== false ? <Card card={card} played={true} /> : ''}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="right-cards">
                                            {rightCards.map((card) => (
                                                <div
                                                    key={card.id}
                                                    style={rightCardStyle}
                                                >
                                                    <Card card={card} />
                                                    Matricule #{card.name}:
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                            {game.rounds == game.player_points || game.rounds == game.computer_points ? (
                                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    {next && <button onClick={() => nextGame()} style={{
                                        color: "#F9DC5C",
                                        backgroundColor: "green",
                                        padding: "10px 50px",
                                        margin: 10,
                                        transition: "background-color 0.3s ease",
                                        borderRadius: 5,
                                        textDecoration: "none"
                                    }} > Finish Game </button>}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    {next && <button onClick={() => nextGame()} style={{
                                        color: "#F9DC5C",
                                        backgroundColor: "green",
                                        padding: "10px 50px",
                                        margin: 10,
                                        transition: "background-color 0.3s ease",
                                        borderRadius: 5,
                                        textDecoration: "none"
                                    }} > Next Game </button>}
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
                            )}
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
            )
            }
        </>
    );
};

export default Game;
