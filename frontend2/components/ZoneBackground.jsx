import React from 'react';

const ZoneBackground = ({zonePnj, children }) => {
  const zoneStyle = {
    position: 'fixed', // Rend le background fixe lors du scroll
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${zonePnj.zone_image})`,
    backgroundSize: 'cover', // Assure que l'image couvre tout l'arrière-plan
    backgroundPosition: 'center', // Centre l'image
    zIndex: -1, // Met le background derrière tout le reste
    overflow: 'hidden',
  };

  return (
    <>
      <div style={zoneStyle}></div>
      <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
        {children}
      </div>
    </>
  );
};

export default ZoneBackground;
