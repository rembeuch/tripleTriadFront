import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useAccount, useProvider, useSigner } from 'wagmi'
import CardPvp from '@/components/CardPvp';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import { useAuth } from '@/contexts/authContext';

const Pvp = () => {
    const { authToken } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [player, setPlayer] = useState(null);
    const [playerNumber, setPlayerNumber] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [board, setBoard] = useState(Array(9).fill(false));
    const [leftCards, setLeftCards] = useState([]);
    const [rightCards, setRightCards] = useState([]);
    const [pvp, setPvp] = useState(null);
    const [turn, setTurn] = useState(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [playerPowerPoints, setPlayerPowerPoints] = useState(0);
    const [playerPower, setPlayerPower] = useState(false);
    const [playerComputerPowerPoints, setPlayerComputerPowerPoints] = useState(0);
    const [playerComputerPower, setPlayerComputerPower] = useState(false);
    const [endgame, setEndgame] = useState(false);
    const [endAlert, setEndAlert] = useState('');
    const [next, setNext] = useState(false);
    const [reward, setReward] = useState(null);
    const [rewardMessage, setRewardMessage] = useState(null);
    const [messagePvp, setMessagePvp] = useState(null);
    const { address, } = useAccount()
    const [isWebSocketActive, setIsWebSocketActive] = useState(false);


    async function getPlayer() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find?token=${authToken}`}`);
        return response.json();
    }

    async function getPlayerNumber() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find_number?token=${authToken}`}`);
        return response.json();
    }

    async function getPvp() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find_pvp?token=${authToken}`}`);
        return response.json();
    }

    async function fetchPlayerDeck() {
        try {
            const response = await fetch(`${`http://localhost:3000/api/v1/deck_in_pvp?token=${authToken}`}`);
            const json = await response.json();
            setLeftCards(json);
        } catch (error) {
            console.error("Failed to fetch the computer deck: ", error);
        }
    };

    async function fetchOpponentDeck() {
        try {
            const response = await fetch(`${`http://localhost:3000/api/v1/opponent_deck?token=${authToken}`}`);
            const json = await response.json();
            setRightCards(json);
        } catch (error) {
            console.error("Failed to fetch the computer deck: ", error);
        }
    };

    async function updatePvpBoard() {
        try {
            const response = await fetch(`${`http://localhost:3000/api/v1/pvp_board_position?token=${authToken}`}`);
            const json = await response.json();
            setBoard(json);
        } catch (error) {
            console.error("Failed to update board", error);
        }
    };

    async function getScore() {
        const response = await fetch(`${`http://localhost:3000/api/v1/get_pvp_score?token=${authToken}`}`);
        if (response.ok) {
            const responseScore = await response.json();
            setPlayerScore(responseScore.player_score)
            setComputerScore(responseScore.opponent_score)
            setPlayerPowerPoints(responseScore.player_pvp_power_points)
            setPlayerPower(responseScore.player_pvp_power)
            setPlayerComputerPowerPoints(responseScore.opponent_pvp_power_points)
            setPlayerComputerPower(responseScore.opponent_pvp_power)
        }
    }

    async function win() {
        const response = await fetch(`${`http://localhost:3000/api/v1/win_pvp?token=${authToken}`}`)
        const responseWin = await response.json();
        setEndAlert(responseWin.message)
        if (responseWin.message != "") {
            setEndgame(true);
        }
    }

    async function review() {
        if (endgame == false ) {
            setEndgame(true);
            setNext(false)
            setEndAlert("!")
        }
        else {
        setEndgame(false);
        setNext(true)
        }
    }




    async function updatePosition(card_id, position) {
        if (playerNumber == 1) {
            setTurn(2)
        } else {
            setTurn(1)
        }
        const response = await fetch(`${`http://localhost:3000/api/v1/update_pvp_position?token=${authToken}&card_id=${card_id}&position=${position}`}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        await updatePvpBoard();
        fetchOpponentDeck();

        await playerCombo(response)
        await getScore()
        const alertC = document.querySelector('#alertComputer')
        if (alertC) {
            alertC.innerText = ""
        }

        await updatePvpBoard();
        await fetchOpponentDeck();
        await fetchPlayerDeck()
        await getScore()
        const alertP = document.querySelector('#alertPlayer')
        if (alertP) {
            alertP.innerText = ""
        }
        if (playerNumber == 1) {
            setTurn(2)
        } else {
            setTurn(1)
        }
        await win()
    }

    async function playerCombo(response) {
        if (response.ok) {
            const responseData = await response.json();
            const alertP = document.querySelector('#alertPlayer')
            if (alertP) {
                alertP.innerText = responseData.message
            }
            if (responseData.message != '') {
                if (responseData.cards_updated != []) {
                    for (const card_id of responseData.cards_updated) {
                        await processUpdatedCards(card_id);
                    }
                }

            }
        }
    }

    async function processUpdatedCards(card_id) {
        const responseCombo = await fetch(`${`http://localhost:3000/api/v1/pvp_player_combo?token=${authToken}&card_id=${card_id}`}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (responseCombo.ok) {
            const combo = await responseCombo.json();
            const alertP = document.querySelector('#alertPlayer')
            if (alertP) {
                alertP.innerText = combo.message
            } await updatePvpBoard();
            await fetchOpponentDeck();
        }
    }

    async function nextGame() {
        const response = await fetch(`${`http://localhost:3000/api/v1/next_pvp_game?token=${authToken}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const responseData = await response.json();
            if (responseData.id == pvp.id) {
                setEndgame(false)
                await updatePvpBoard();
                await fetchOpponentDeck();
                await fetchPlayerDeck()
                setEndAlert('')
                setNext(false)
            } else {
                window.location.href = "/game/Zones";
            }
        }
    }

    async function superPower() {
        if (turn == true && next == false) {

            const response = await fetch(`${`http://localhost:3000/api/v1/pvp_super_power?token=${authToken}`}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setPlayerPowerPoints(0)
            setPlayerPower(false)
            await getPlayer()
            await updatePvpBoard();
        }
    }

    async function quitGame() {
        const response = await fetch(`${`http://localhost:3000/api/v1/quit_pvp?token=${authToken}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        window.location.href = "/game/Zones";
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
        if (authToken) {
            fetchCurrentPlayer();
        }
    }, [address, authToken]);

    useEffect(() => {

        const fetchPlayerNumber = async () => {
            try {
                const json = await getPlayerNumber();
                setPlayerNumber(json);
            } catch (error) {
                console.error("Failed to fetch the player: ", error);
            }
        };
        if (authToken) {
            fetchPlayerNumber();
        }
    }, [address, authToken]);

    useEffect(() => {
        const fetchCurrentGame = async () => {
            try {
                const json = await getPvp();
                setPvp(json);
                setTurn(json.turn)
            } catch (error) {
                setPvp(null);
                console.error("Failed to fetch the game: ", error);
            }
        };

        if (player) {
            fetchCurrentGame();
        }
    }, [address, authToken, player, endgame, messagePvp]);

    useEffect(() => {
        if (player) {
            getScore()
        }
    }, [address, endgame]);

    useEffect(() => {
        if (player) {
            updatePvpBoard()
        }
    }, [player, messagePvp]);

    useEffect(() => {
        if (turn == 3) {
            setEndgame(true);
            setEndAlert("!")
            setNext(true)
        } else {
            setNext(false);
        }
    }, [turn]);

    useEffect(() => {
        const newWs = new WebSocket('ws://localhost:3000/cable');

        if (isWebSocketActive) {

            newWs.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessagePvp(data);
            };
        }
        if (board.every(element => element !== false)) {
            newWs.close();
        }

    }, [isWebSocketActive]);

    useEffect(() => {
        if (turn == playerNumber || turn == 3) {
            setIsWebSocketActive(false)
        } else {
            setIsWebSocketActive(true)
        }
    }, [turn, board, next]);


    useEffect(() => {
        if (player) {
            fetchPlayerDeck();
        }
    }, [address, authToken, player, playerPower]);


    useEffect(() => {
        if (player) {
            fetchOpponentDeck();
        }
    }, [address, authToken, player, playerPower, messagePvp]);

    useEffect(() => {
        if (player) {
            getScore();
        }
    }, [playerScore, computerScore, authToken, player, playerPower, playerComputerPower]);

    const handleCardClick = (card) => {
        if (turn == playerNumber) {
            setSelectedCard(card);
            updatePvpBoard()
        }
    };

    const handleTileClick = (index) => {
        if (turn == playerNumber) {
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

    const playerCardStyle = (card) => {
        return {
            background: ((parseInt(card.player_id) == parseInt(player.id) && card.computer &&
                '#FFC0CB') ||
                (parseInt(card.player_id) == parseInt(player.id) && !card.computer &&
                    '#87CEEB')
                ||
                (parseInt(card.player_id) != parseInt(player.id) && !card.computer &&
                    '#FFC0CB')
                ||
                (parseInt(card.player_id) != parseInt(player.id) && card.computer &&
                    '#87CEEB')
            ),
            width: '220px',
            height: '220px',
            border: '1px solid #aaa',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            cursor: 'pointer',
            transition: 'background-color 0.5s ease',
        }
    };


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

    if (!pvp) return <h2>Loading...</h2>;
    if (!player) return <h2>Loading...</h2>;
    if (!leftCards) return <h2>Loading...</h2>;
    if (!board) return <h2>Loading...</h2>;
    if (!playerNumber) return <h2>Loading...</h2>;

    return (
        <>
            {player ? (
                <>
                    {pvp.id == id ?
                        (<>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <p>{player.name} {playerNumber} rounds:
                                    {playerNumber == 1 ? (
                                        <span>
                                            {pvp.player1_points}
                                        </span>
                                    ) : (
                                        <span>
                                            {pvp.player2_points}
                                        </span>
                                    )}
                                </p>
                                <p>turn: {pvp.turn} / rounds to win: {pvp.rounds}</p>
                                <p> rounds: {playerNumber == 1 ? (
                                    <span>
                                        {pvp.player2_points}
                                    </span>
                                ) : (
                                    <span>
                                        {pvp.player1_points}
                                    </span>
                                )} The Machine </p>
                            </div>
                            {endgame ? (

                                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    <p>Score: {playerScore}</p>
                                    {endAlert != "" &&
                                        <div>
                                            <Alert status='warning' width="100%">
                                                <AlertIcon />
                                                {endAlert}!
                                            </Alert>
                                            {pvp.rounds == pvp.player1_points || pvp.rounds == pvp.player2_points ? (
                                                <div style={{ justifyContent: 'space-around' }}>
                                                    {pvp.rounds == pvp.player1_points && playerNumber == 1 &&
                                                        <div>
                                                            + 1 Elite Point
                                                        </div>

                                                    }
                                                    {pvp.rounds == pvp.player2_points && playerNumber == 2 &&

                                                        <div>
                                                            + 1 Elite Point
                                                        </div>
                                                    }

                                                    <p>Energy +  {playerNumber == 1 ? (
                                                        <span>
                                                            {pvp.player1_points * 10}
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            {pvp.player2_points * 10}
                                                        </span>
                                                    )} </p>
                                                    <button onClick={() => nextGame()} style={{
                                                        color: "#F9DC5C",
                                                        backgroundColor: "green",
                                                        padding: "10px 50px",
                                                        margin: 10,
                                                        transition: "background-color 0.3s ease",
                                                        borderRadius: 5,
                                                        textDecoration: "none"
                                                    }} > Finish </button>


                                                    {
                                                        <button onClick={() => review()} style={{
                                                            color: "#F9DC5C",
                                                            backgroundColor: "blue",
                                                            padding: "10px 50px",
                                                            margin: 10,
                                                            transition: "background-color 0.3s ease",
                                                            borderRadius: 5,
                                                            textDecoration: "none"
                                                        }} >  Review Board </button>
                                                    }
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                    <button onClick={() => nextGame()} style={{
                                                        color: "#F9DC5C",
                                                        backgroundColor: "green",
                                                        padding: "10px 50px",
                                                        margin: 10,
                                                        transition: "background-color 0.3s ease",
                                                        borderRadius: 5,
                                                        textDecoration: "none"
                                                    }} > Next Game </button>


                                                    <button onClick={() => review()} style={{
                                                        color: "#F9DC5C",
                                                        backgroundColor: "blue",
                                                        padding: "10px 50px",
                                                        margin: 10,
                                                        transition: "background-color 0.3s ease",
                                                        borderRadius: 5,
                                                        textDecoration: "none"
                                                    }} >  Review Board </button>

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
                                        </div>
                                    }
                                    <p>Score: {computerScore}</p>
                                </div>
                            ) : (

                                < div style={gameStyle} >
                                    <div className="left-cards">
                                        {leftCards.map((card) => (
                                            <div
                                                key={card.id}
                                                style={selectedCard === card ? selectedCardStyle : leftCardStyle}
                                                onClick={() => handleCardClick(card)}
                                            >
                                                # {card.name}:
                                                <CardPvp player={card.player} card={card} />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                            <p> {player.ability} {playerPower ? (<> <button onClick={() => superPower()}> 🔥</button> <span className='' id='alertPlayer' width="100%"></span> </>)
                                                : (<span className='' id='alertPlayer' width="100%">
                                                </span>)}</p>
                                            {playerComputerPower ? (<p><span className='' id='alertComputer' width="100%">
                                            </span>🔥 </p>) : (<p> <span className='' id='alertComputer' width="100%">
                                            </span></p>)}
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
                                                    {card !== false ? <CardPvp card={card} played={true} /> : ""}
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
                                                    {card !== false ? <CardPvp card={card} played={true} /> : ''}
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
                                                    {card !== false ? <CardPvp card={card} played={true} /> : ''}
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
                                                <CardPvp player={player} card={card} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {next && endgame == false &&
                                <button onClick={() => review()} style={{
                                    color: "#F9DC5C",
                                    backgroundColor: "blue",
                                    padding: "10px 50px",
                                    margin: 10,
                                    transition: "background-color 0.3s ease",
                                    borderRadius: 5,
                                    textDecoration: "none"
                                }} >  Back To Results </button>
                            }
                            {endgame == false &&
                                <div style={{
                                    display: "flex",
                                    margin: 10,
                                    justifyContent: "center"
                                }}>
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
                            }
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
                    Loading!
                </Alert>
            )
            }
        </>
    );
};

export default Pvp;
