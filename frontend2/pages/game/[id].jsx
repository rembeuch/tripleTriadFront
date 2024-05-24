import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useAccount, useProvider, useSigner } from 'wagmi'
import Card from '@/components/Card';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import SuperPowerModal from '@/components/SuperPowerModal';
import { useAuth } from '@/contexts/authContext';
import Layout from '@/components/Layout/Layout';



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
    const [turn, setTurn] = useState(true);
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [playerPowerPoints, setPlayerPowerPoints] = useState(0);
    const [playerPower, setPlayerPower] = useState(false);
    const [playerComputerPowerPoints, setPlayerComputerPowerPoints] = useState(0);
    const [playerComputerPower, setPlayerComputerPower] = useState(false);
    const [bossLife, setBossLife] = useState(0);
    const [endgame, setEndgame] = useState(false);
    const [endAlert, setEndAlert] = useState('');
    const [next, setNext] = useState(false);
    const [reward, setReward] = useState(null);
    const [rewardMessage, setRewardMessage] = useState(null);
    const [zoneMessage, setZoneMessage] = useState(null);
    const [bZoneMessage, setBZoneMessage] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [superPowerCard, setSuperPowerCard] = useState(null);
    const [superPowerCardInfo, setSuperPowerCardInfo] = useState([]);



    const { address, } = useAccount()

    async function getPlayer() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find_player?token=${authToken}`}`);
        return response.json();
    }

    async function getGame() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find_game?id=${player.id}`}`);
        return response.json();
    }

    async function fetchPlayerDeck() {
        try {
            const response = await fetch(`${`http://localhost:3000/api/v1/deck_in_game?id=${player.id}`}`);
            const json = await response.json();
            setLeftCards(json);
        } catch (error) {
            console.error("Failed to fetch the computer deck: ", error);
        }
    };

    async function fetchComputerDeck() {
        try {
            const response = await fetch(`${`http://localhost:3000/api/v1/computer_deck?id=${player.id}`}`);
            const json = await response.json();
            setRightCards(json);
        } catch (error) {
            console.error("Failed to fetch the computer deck: ", error);
        }
    };

    async function updateBoard() {
        try {
            const response = await fetch(`${`http://localhost:3000/api/v1/board_position?id=${player.id}`}`);
            const json = await response.json();
            setBoard(json);
        } catch (error) {
            console.error("Failed to update board", error);
        }
    };

    async function getScore() {
        const response = await fetch(`${`http://localhost:3000/api/v1/get_score?id=${player.id}`}`);
        if (response.ok) {
            const responseScore = await response.json();
            setPlayerScore(responseScore.player_score)
            setComputerScore(responseScore.computer_score)
            setPlayerPowerPoints(responseScore.player_power_points)
            setPlayerPower(responseScore.player_power)
            setPlayerComputerPowerPoints(responseScore.player_computer_power_points)
            setPlayerComputerPower(responseScore.player_computer_power)
            if (responseScore.boss_life) {
                setBossLife(responseScore.boss_life)
            }
        }
    }

    async function win() {
        const response = await fetch(`${`http://localhost:3000/api/v1/win?id=${player.id}`}`)
        const responseWin = await response.json();
        setEndAlert(responseWin.message)
        if (responseWin.message != "") {
            setTimeout(() => {
                setEndgame(true);
            }, 3000);
        }

    }

    async function review() {
        if (endgame == true && next == true) {
            setEndgame(false);
            setNext(true)
        }
        else {
            setEndgame(true);
            setNext(false)
            if (game.boss == false) {
                if (playerScore - computerScore > 1) {
                    setEndAlert("You Win!");
                } else if (computerScore - playerScore > 1) {
                    setEndAlert("You Lose!");
                } else if (playerScore === computerScore || playerScore - computerScore === 1 || computerScore - playerScore === 1) {
                    setEndAlert("Draw!");
                }
            }
            if (game.boss == true) {
                if (playerScore - game.rounds >= 0) {
                    setEndAlert("You Win!");
                } else if (computerScore - playerScore > 1) {
                    setEndAlert("You Lose!");
                } else if (game.rounds - playerScore > 0) {
                    setEndAlert("Continue!");
                }
            }
        }
    }

    async function updatePosition(card_id, position) {
        setTurn(false)
        const response = await fetch(`${`http://localhost:3000/api/v1/update_position?id=${player.id}&card_id=${card_id}&position=${position}`}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        updateBoard();
        fetchComputerDeck();

        await playerCombo(response)
        await getScore()
        document.querySelector('#alertComputer').innerText = ""


        const computerResponse = await fetch(`${`http://localhost:3000/api/v1/update_computer_position?id=${player.id}`}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });
        updateBoard();
        fetchComputerDeck();

        await computerCombo(computerResponse)
        await updateBoard();
        await fetchComputerDeck();
        await fetchPlayerDeck()
        await getScore()
        document.querySelector('#alertPlayer').innerText = ""
        await win()
        setTurn(true)
    }

    async function playerCombo(response) {
        if (response.ok) {
            const responseData = await response.json();
            document.querySelector('#alertPlayer').innerText = responseData.message
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
        const responseCombo = await fetch(`${`http://localhost:3000/api/v1/player_combo?id=${player.id}&card_id=${card_id}`}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (responseCombo.ok) {
            const combo = await responseCombo.json();
            document.querySelector('#alertPlayer').innerText = combo.message
            await updateBoard();
            await fetchComputerDeck();
        }
    }

    async function computerCombo(computerResponse) {
        if (computerResponse.ok) {
            const responseComputer = await computerResponse.json();
            document.querySelector('#alertComputer').innerText = responseComputer.message
            if (responseComputer.message != "") {
                if (responseComputer.cards_updated != []) {
                    for (const card_id of responseComputer.cards_updated) {
                        await processUpdatedCardsComputer(card_id);
                    }
                }
            }
        }
    }

    async function processUpdatedCardsComputer(card_id) {

        const responseCombo = await fetch(`${`http://localhost:3000/api/v1/computer_combo?id=${player.id}&card_id=${card_id}`}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const combo = await responseCombo.json();
        document.querySelector('#alertComputer').innerText = combo.message
        await updateBoard();
        await fetchComputerDeck();
    }

    async function nextGame(zone_message) {
        const response = await fetch(`${`http://localhost:3000/api/v1/next_game?id=${player.id}&zone_message=${zone_message}`}`,
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
                window.location.href = "/game/Zones";
            }
        }
    }

    async function superPower() {
        if (turn == true && next == false) {
            if (superPowerCard) {
                const cardInfoString = encodeURIComponent(JSON.stringify(superPowerCardInfo));

                const response = await fetch(`${`http://localhost:3000/api/v1/super_power?id=${player.id}&card_id=${superPowerCard.id}&card_info=${cardInfoString}`}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
            else {
                const response = await fetch(`${`http://localhost:3000/api/v1/super_power?id=${player.id}`}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
            setPlayerPowerPoints(0)
            setPlayerPower(false)
            setSuperPowerCard(null)
            setSuperPowerCardInfo([])
            await getPlayer()
            await updateBoard();
        }
    }

    const handleMouseEnter = () => {
        if (superPowerCard == null) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const changeSuperPowerCards = (cardSide) => {
        if (player.ability[player.ability.length - 1] == "0" && typeof cardSide !== 'string') {
            if (superPowerCardInfo.length == 0) {
                if (cardSide.position == "9" && cardSide.computer) {
                    setSuperPowerCardInfo([...superPowerCardInfo, `hide${cardSide.name}`]);
                }
                else {
                    setSuperPowerCardInfo([...superPowerCardInfo, cardSide.name]);
                }
            }
            else {
                setSelectedCard(null);
                setSuperPowerCard(cardSide);
                setIsHovered(false);
            }
        }
        else {
            setSelectedCard(null);
            setSuperPowerCard(cardSide);
            setIsHovered(false);
        }
    };

    const pushSuperPowerCards = (info) => {
        setSuperPowerCardInfo([...superPowerCardInfo, info]);
    };

    const cancelSuperPowerCards = () => {
        setSuperPowerCard(null);
        setSuperPowerCardInfo([]);
        setIsHovered(false);
    };

    const handleSuperPowerCard = (card) => {
        if (turn && card) {
            if (player.ability.startsWith("leadership5") && card.computer == false) { return }
            setSelectedCard(null);
            changeSuperPowerCards(card)
        }
    };

    const handleCardClick = (card) => {
        if (game.boss && bossLife <= 0) {
            return
        }
        if (turn) {
            if (superPowerCard == null) {
                setSelectedCard(card);
            }
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
                const updatedLeftCards = leftCards.filter((card) => card.id !== selectedCard.id)
                setLeftCards(updatedLeftCards);
            }
        }
    };


    async function getRewardMessage(message) {
        setRewardMessage(message)
    }

    async function getZoneMessage(message) {
        setZoneMessage(message)
    }

    async function getBZoneMessage(message) {
        setBZoneMessage(message)
    }

    async function getReward(index) {
        const response = await fetch(`${`http://localhost:3000/api/v1/reward?id=${player.id}&monster_index=${index}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const responseData = await response.json();
            setReward(responseData.monster)
            if (responseData.message != "") {
                await getRewardMessage(responseData.message)
            }
            if (responseData.zone_message != "") {
                await getZoneMessage(responseData.zone_message)
            }
            if (responseData.b_zone_message != "") {
                await getBZoneMessage(responseData.b_zone_message)
            }
        }
    }

    async function quitGame() {
        const response = await fetch(`${`http://localhost:3000/api/v1/quit_game?id=${player.id}`}`,
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
        fetchCurrentPlayer();
    }, [authToken, reward]);

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
    }, [authToken, player, endgame]);

    useEffect(() => {
        if (player) {
            getScore()
        }
    }, [endgame]);

    useEffect(() => {
        if (game) {
            setBossLife(game.player_points - game.rounds)
        }
    }, [endgame]);

    useEffect(() => {
        if (player) {
            setBoard(board)
            if (board.every(element => element !== false)) {
                setTimeout(() => {
                    setNext(true);
                }, 3000);
            } else {
                setNext(false);
            }
        }
        if (game && game.boss) {
            if (bossLife <= 0) {
                setNext(true);
            }
        }
    }, [board, next]);

    useEffect(() => {
        if (player) {
            fetchPlayerDeck();
        }
    }, [authToken, player, playerPower]);


    useEffect(() => {
        if (player) {
            fetchComputerDeck();
        }
    }, [authToken, player, playerPower]);

    useEffect(() => {
        if (player) {
            updateBoard();
        }
    }, [authToken, player]);

    useEffect(() => {
        if (player) {
            getScore();
        }
    }, [playerScore, computerScore, authToken, player, playerPower, playerComputerPower]);




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
        cursor: '',

    };

    const leftCardStyle = {
        ...cardStyle,
        marginRight: "25px",
        backgroundColor: typeof superPowerCard === 'string' && superPowerCard.includes("left") ? 'purple' : '#87CEEB',

    };

    const rightCardStyle = {
        ...cardStyle,
        marginLeft: "15px",
        display: 'block',
        backgroundColor: typeof superPowerCard === 'string' && superPowerCard.includes("right") ? 'purple' : '#FFC0CB',
    };

    const getBackGroundPlayerCard = (card) => {
        if (typeof superPowerCard === 'string' && superPowerCard.includes("board")) {
            if (player.ability == "leadership5") {
                return card.computer ? 'purple' : '#87CEEB';
            }
            return 'purple';
        }
        return card.computer ? '#FFC0CB' : '#87CEEB';
    }

    const playerCardStyle = (card) => ({
        backgroundColor: getBackGroundPlayerCard(card),
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

    const powerButtonStyle = {
        position: 'relative',
        transition: "background-color 0.3s ease",
        textDecoration: "none",
    };

    if (!game) return <h2>Loading...</h2>;
    if (!player) return <h2>Loading...</h2>;
    if (!leftCards) return <h2>Loading...</h2>;
    if (!board) return <h2>Loading...</h2>;

    return (
        <>
            <Layout pvp={player.in_pvp}>


                {player ? (
                    <>
                        {game.id == id ?
                            (<>
                                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    {game.boss ?
                                        (
                                            <p style={{ paddingLeft: '20px', paddingRight: '20px' }}>Boss Life ☠️ {bossLife}</p>
                                        )
                                        : (<>
                                            <p style={{ paddingRight: '20px' }}>{player.name} rounds: {game.player_points}</p>
                                            <p style={{ paddingLeft: '20px', paddingRight: '20px' }}>rounds to win: {game.rounds}</p>
                                            <p style={{ paddingLeft: '20px' }}> rounds: {game.computer_points} The Machine </p>
                                        </>
                                        )
                                    }
                                </div>
                                {endgame ? (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <p>Score: {playerScore}</p>
                                            {endAlert != "" &&
                                                <div>
                                                    <Alert status='warning' width="100%">
                                                        <AlertIcon />
                                                        {endAlert}!
                                                    </Alert>
                                                    {game.rounds <= game.player_points || game.rounds == game.computer_points ? (
                                                        <div style={{ justifyContent: 'space-around' }}>
                                                            {game.rounds <= game.player_points ? (
                                                                <>
                                                                    {!reward &&
                                                                        <div id='reward' className="left-cards" style={{ display: 'flex' }}>
                                                                            <h2>Get Reward</h2>
                                                                            {game.boss && <div
                                                                                onClick={() => getReward(0)}
                                                                                style={leftCardStyle}
                                                                            >
                                                                                <Card reveal={true} />
                                                                            </div>}
                                                                            <>
                                                                                {!game.boss &&
                                                                                    <>
                                                                                        {
                                                                                            game.monsters ?
                                                                                                (<div
                                                                                                    onClick={() => getReward(0)}
                                                                                                    style={leftCardStyle}
                                                                                                >
                                                                                                    <Card reveal={true} />
                                                                                                </div>
                                                                                                ) : ([0, 1, 2, 3, 4].map((index) => (
                                                                                                    <div
                                                                                                        key={index}
                                                                                                        onClick={() => getReward(index)}
                                                                                                        style={leftCardStyle}
                                                                                                    >
                                                                                                        <Card reveal={true} />
                                                                                                    </div>
                                                                                                )))
                                                                                        }
                                                                                    </>
                                                                                }
                                                                            </>

                                                                        </div>
                                                                    }
                                                                    {reward &&
                                                                        <>
                                                                            <div>{rewardMessage}</div>
                                                                            <h2>Your Reward: Energy + {game.player_points * 10}</h2>
                                                                            <div style={selectedCardStyle}>
                                                                                {reward.name}:
                                                                                <Card card={reward} />
                                                                            </div>
                                                                            <h2>Select next Level
                                                                                {player.s_zone && " / You find a safe zone!"}
                                                                            </h2>
                                                                            <div style={{ display: "flex" }}>
                                                                                {zoneMessage != null &&
                                                                                    <button onClick={() => nextGame("A")} style={{
                                                                                        color: "#F9DC5C",
                                                                                        backgroundColor: "green",
                                                                                        padding: "10px 50px",
                                                                                        margin: 10,
                                                                                        transition: "background-color 0.3s ease",
                                                                                        borderRadius: 5,
                                                                                        textDecoration: "none"
                                                                                    }}>{zoneMessage}</button>
                                                                                }
                                                                                {bZoneMessage &&
                                                                                    <button onClick={() => nextGame("B")} style={{
                                                                                        color: "#F9DC5C",
                                                                                        backgroundColor: "purple",
                                                                                        padding: "10px 50px",
                                                                                        margin: 10,
                                                                                        transition: "background-color 0.3s ease",
                                                                                        borderRadius: 5,
                                                                                        textDecoration: "none"
                                                                                    }}>{bZoneMessage}</button>
                                                                                }
                                                                                {player.zones[0].slice(0, 5) == "bossA" &&
                                                                                    <button onClick={() => nextGame("Aboss")} style={{
                                                                                        color: "#F9DC5C",
                                                                                        backgroundColor: "green",
                                                                                        padding: "10px 50px",
                                                                                        margin: 10,
                                                                                        transition: "background-color 0.3s ease",
                                                                                        borderRadius: 5,
                                                                                        textDecoration: "none"
                                                                                    }}>Boss {zoneMessage} 💀</button>
                                                                                }
                                                                                {player.zones[0].slice(0, 5) == "bossB" &&
                                                                                    <button onClick={() => nextGame("Bboss")} style={{
                                                                                        color: "#F9DC5C",
                                                                                        backgroundColor: "purple",
                                                                                        padding: "10px 50px",
                                                                                        margin: 10,
                                                                                        transition: "background-color 0.3s ease",
                                                                                        borderRadius: 5,
                                                                                        textDecoration: "none"
                                                                                    }}>Boss {bZoneMessage} 💀</button>
                                                                                }
                                                                                {player.zones.length > 1 && player.zones[1].slice(0, 5) == "bossB" &&
                                                                                    <button onClick={() => nextGame("Bboss")} style={{
                                                                                        color: "#F9DC5C",
                                                                                        backgroundColor: "purple",
                                                                                        padding: "10px 50px",
                                                                                        margin: 10,
                                                                                        transition: "background-color 0.3s ease",
                                                                                        borderRadius: 5,
                                                                                        textDecoration: "none"
                                                                                    }}>Boss {bZoneMessage} 💀</button>
                                                                                }
                                                                            </div>
                                                                        </>
                                                                    }
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <p>Energy + {game.player_points * 10}</p>
                                                                    <button onClick={() => nextGame()} style={{
                                                                        color: "#F9DC5C",
                                                                        backgroundColor: "purple",
                                                                        padding: "10px 50px",
                                                                        margin: 10,
                                                                        transition: "background-color 0.3s ease",
                                                                        borderRadius: 5,
                                                                        textDecoration: "none"
                                                                    }} > Game Over </button>
                                                                </>
                                                            )}
                                                            {next &&
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
                                                            {next && <button onClick={() => nextGame()} style={{
                                                                color: "#F9DC5C",
                                                                backgroundColor: "green",
                                                                padding: "10px 50px",
                                                                margin: 10,
                                                                transition: "background-color 0.3s ease",
                                                                borderRadius: 5,
                                                                textDecoration: "none"
                                                            }} > Next Game </button>}
                                                            {next &&
                                                                <>
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
                                                                </>
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                            <p>Score: {computerScore}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        < div style={gameStyle} >
                                            <div className="left-cards">
                                                {leftCards.map((card) => (
                                                    <>
                                                        <div
                                                            key={card.id}
                                                            style={selectedCard === card ? selectedCardStyle : leftCardStyle}
                                                            onClick={typeof superPowerCard === 'string' && superPowerCard.includes("left") ? () => handleSuperPowerCard(card) : () => handleCardClick(card)}
                                                        >
                                                            <p> {card.name} </p>
                                                            <Card card={card} />
                                                        </div>
                                                    </>
                                                ))}
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                                    <div> {player.ability} {playerPower ? (
                                                        <>
                                                            <button style={powerButtonStyle} onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()} >
                                                                🔥<SuperPowerModal power={player.ability} isHovered={isHovered} superPower={superPower} superPowerCard={superPowerCard} superPowerCardInfo={superPowerCardInfo} changeSuperPowerCards={changeSuperPowerCards} cancelSuperPowerCards={cancelSuperPowerCards} pushSuperPowerCards={pushSuperPowerCards} /></button>
                                                            <span className='' id='alertPlayer' width="100%"></span>
                                                        </>
                                                    )
                                                        : (<span className='' id='alertPlayer' width="100%">
                                                        </span>)}
                                                    </div>
                                                    {playerComputerPower ?
                                                        (<p><span className='' id='alertComputer' width="100%">
                                                        </span>🔥 {player.ability.startsWith("espionage") && parseInt(player.ability[9] + player.ability[10]) >= 5 && player.computer_ability}</p>)
                                                        :
                                                        (<p> <span className='' id='alertComputer' width="100%">
                                                        </span>{player.ability.startsWith("espionage") && parseInt(player.ability[9] + player.ability[10]) >= 5 && player.computer_ability}</p>)
                                                    }
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
                                                            onClick={typeof superPowerCard === 'string' && superPowerCard.includes("board") ? () => handleSuperPowerCard(card) : () => handleTileClick(index)}
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
                                                            onClick={typeof superPowerCard === 'string' && superPowerCard.includes("board") ? () => handleSuperPowerCard(card) : () => handleTileClick(index + 3)}
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
                                                            onClick={typeof superPowerCard === 'string' && superPowerCard.includes("board") ? () => handleSuperPowerCard(card) : () => handleTileClick(index + 6)}
                                                            style={card ? playerCardStyle(card) : tyleCardStyle}
                                                        >
                                                            {card !== false ? <Card card={card} played={true} /> : ''}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="right-cards">
                                                {rightCards.map((card) => (
                                                    <>
                                                        <div
                                                            key={card.id}
                                                            style={rightCardStyle}
                                                            onClick={typeof superPowerCard === 'string' && superPowerCard.includes("right") ? () => handleSuperPowerCard(card) : () => handleCardClick(card)}
                                                        >
                                                            <p style={{}}>
                                                                {!card.hide && card.name}
                                                            </p>
                                                            <Card reveal={true} />
                                                        </div>
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                    </>
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
            </Layout>
        </>
    );
};

export default Game;
