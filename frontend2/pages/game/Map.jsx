import React, { useRef, useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import Layout from '@/components/Layout/Layout'
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/authContext';
import Link from 'next/link';
import gsap from 'gsap';



class Avatar {
    constructor() {
        this.position = {
            x: 100,
            y: 100,
        }

        this.width = 50
        this.height = 50
    }

    draw(context) {
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Zone {
    constructor(x, y, width, height) {
        this.position = {
            x: x,
            y: y,
        }

        this.width = width;
        this.height = height;
    }

    draw(context) {
        context.fillStyle = 'green';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}




const GameCanvas = (player) => {
    const { authToken } = useAuth();
    const [battleZone, setbattleZone] = useState(false);
    const router = useRouter();
    const canvasRef = useRef(null);
    const keys = {
        arrowUp: { pressed: false },
        arrowDown: { pressed: false },
        arrowRight: { pressed: false },
        arrowLeft: { pressed: false }
    };

    async function createGame() {
        gsap.to('#overlappingDiv', {
            opacity: 1,
            repeat: 3,
            yoyo: true,
            duration: 0.4,
            onComplete() {
              gsap.to('#overlappingDiv', {
                opacity: 1,
                duration: 0.4,
                onComplete() {
                  // activate a new animation loop
                  gsap.to('#overlappingDiv', {
                    opacity: 0,
                    duration: 0.4
                  })
                }
              })
            }
          })
        const response = await fetch(`${`http://localhost:3000/api/v1/games?token=${authToken}`}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            const responseData = await response.json();
            const gameId = responseData.id;
            router.push(`/game/${gameId}`)
        } else {

        }
    }

    useEffect(() => {
        if (battleZone) {
            createGame()
        }
    }, [battleZone]);



    useEffect(() => {
        if (player) {
            if (player.in_game == true) {
                setbattleZone(true)
            }
        }
    }, [player]);



    useEffect(() => {

        const zones = [
            new Zone(500, 100, 500, 100), // Zone 1
            new Zone(200, 300, 300, 150), // Zone 2
        ];
        const avatar = new Avatar();
        let battleInitiate = false

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    keys.arrowUp.pressed = true;
                    break;
                case 'ArrowDown':
                    keys.arrowDown.pressed = true;
                    break;
                case 'ArrowRight':
                    keys.arrowRight.pressed = true;
                    break;
                case 'ArrowLeft':
                    keys.arrowLeft.pressed = true;
                    break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    keys.arrowUp.pressed = false;
                    break;
                case 'ArrowDown':
                    keys.arrowDown.pressed = false;
                    break;
                case 'ArrowRight':
                    keys.arrowRight.pressed = false;
                    break;
                case 'ArrowLeft':
                    keys.arrowLeft.pressed = false;
                    break;
            }
        };

        async function checkCollisions() {
            zones.forEach((zone) => {
                if (
                    avatar.position.x < zone.position.x + zone.width &&
                    avatar.position.x + avatar.width > zone.position.x &&
                    avatar.position.y < zone.position.y + zone.height &&
                    avatar.position.y + avatar.height > zone.position.y &&
                    Math.random() < 0.001
                ) {
                    battleInitiate = true
                    setbattleZone(true)
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);




        const animate = () => {
            requestAnimationFrame(animate);
            const canvas = canvasRef.current;
            if (canvas) {
                const context = canvas.getContext('2d');
                canvas.width = 64 * 16; // 1024
                canvas.height = 64 * 9; // 576
                context.fillStyle = 'white';
                context.fillRect(0, 0, canvas.width, canvas.height);
                zones.forEach(zone => zone.draw(context));
                avatar.draw(context);
            }

            if (battleInitiate) return
            if (keys.arrowUp.pressed) {
                avatar.position.y = avatar.position.y - 3
            }
            if (keys.arrowDown.pressed) {
                avatar.position.y = avatar.position.y + 3
            }
            if (keys.arrowLeft.pressed) {
                avatar.position.x = avatar.position.x - 3
            }
            if (keys.arrowRight.pressed) {
                avatar.position.x = avatar.position.x + 3
            }

            checkCollisions();
        };
        animate();



    }, []);

    const overlayStyle = {
        backgroundColor: 'black',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 10,
    };

    return (
        <>
            <div id="overlappingDiv" style={overlayStyle}></div>
            <canvas ref={canvasRef} style={{ backgroundColor: 'black', height: '100vh' }} />
        </>
    );
};

const Map = () => {
    const [player, setPlayer] = useState(null);
    const [pvp, setPvp] = useState(null);
    const [game, setGame] = useState(null);
    const { authToken } = useAuth();

    async function getPlayer() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find?token=${authToken}`}`);
        return response.json();
    }

    async function getGame() {
        const response = await fetch(`${`http://localhost:3000/api/v1/find_game?token=${authToken}`}`);
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
    }, [player]);


    useEffect(() => {
        if (player) {
            setPvp(player.in_pvp);
        }
    }, [player]);



    if (!player) return <h2>Loading...</h2>;

    return (
        <Layout pvp={pvp}>
            <div>
                {game ? (<Link href="/game/[id]" as={`/game/${game.id}`}>
                    <button style={{
                        color: "#F9DC5C",
                        backgroundColor: "green",
                        padding: "10px 50px",
                        margin: 10,
                        transition: "background-color 0.3s ease",
                        borderRadius: 5,
                        textDecoration: "none"
                    }} > Current Fight </button>
                </Link>) : (
                    <GameCanvas player={player} />
                )
                }
            </div>
        </Layout>
    );
};

export default Map;
