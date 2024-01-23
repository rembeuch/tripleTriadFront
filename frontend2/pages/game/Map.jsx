import React, { useRef, useEffect } from 'react';

class Player {
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

const GameCanvas = () => {
    const canvasRef = useRef(null);
    const keys = {
        arrowUp: { pressed: false },
        arrowDown: { pressed: false },
        arrowRight: { pressed: false },
        arrowLeft: { pressed: false }
    };

    useEffect(() => {


        const avatar = new Player();

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

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const animate = () => {
            requestAnimationFrame(animate);
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            canvas.width = 64 * 16; // 1024
            canvas.height = 64 * 9; // 576
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);

            avatar.draw(context);

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
        };

        animate();


    }, []); // La dépendance vide assure que cela ne s'exécute qu'une seule fois à la création du composant

    return (
        <canvas ref={canvasRef} style={{ backgroundColor: 'black', height: '100vh' }} />
    );
};

const Map = () => {
    return (
        <div>
            <GameCanvas />
        </div>
    );
};

export default Map;
