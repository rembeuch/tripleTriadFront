import React from 'react';

const CosmosBackground = ({ children }) => {
  // Styles CSS-in-JS
  const cosmosStyle = {
    position: 'fixed', // Rend le background fixe lors du scroll
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, #1c1e29, #0d0e15 60%, #010108)',
    zIndex: -1, // Met le background derrière tout le reste
    overflow: 'hidden',
  };

  const starBaseStyle = {
    position: 'absolute', // Positionne les étoiles relativement au fond fixe
    backgroundColor: 'white',
    borderRadius: '50%',
    animation: 'starTwinkle 2s infinite ease-in-out',
  };

  // Génération de plusieurs étoiles avec des positions, tailles, et délais différents
  const generateStars = () => {
    const stars = [];
    const numberOfStars = 100; // Nombre d'étoiles

    for (let i = 0; i < numberOfStars; i++) {
      const size = Math.random() * 3 + 1; // Taille aléatoire entre 1px et 4px
      const top = Math.random() * 100; // Position top aléatoire
      const left = Math.random() * 100; // Position left aléatoire
      const duration = Math.random() * 5 + 2; // Durée d'animation aléatoire entre 2s et 7s
      const delay = Math.random() * 5; // Délai d'animation aléatoire jusqu'à 5s

      stars.push({
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      });
    }

    return stars;
  };

  const stars = generateStars();

  // Ajoute l'animation avec keyframes dans le style inline
  const starTwinkleKeyframes = `
    @keyframes starTwinkle {
      0%, 100% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
    }
  `;

  return (
    <>
      {/* Ajoute les étoiles en arrière-plan */}
      <div style={cosmosStyle}>
        {/* Ajoute l'animation comme une balise style */}
        <style>
          {starTwinkleKeyframes}
        </style>

        {/* Affichage dynamique des étoiles */}
        {stars.map((star, index) => (
          <div
            key={index}
            style={{
              ...starBaseStyle,
              width: star.width,
              height: star.height,
              top: star.top,
              left: star.left,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          ></div>
        ))}
      </div>

      {/* Contenu principal qui apparaît au-dessus des étoiles */}
      <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
        {children}
      </div>
    </>
  );
};

export default CosmosBackground;
