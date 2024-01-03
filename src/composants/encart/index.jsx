import React, { useState } from 'react';
import dps from '../table/dps.bmp';
import tank from '../table/tank.bmp';
import heal from '../table/heal.bmp';

function Encart(props) {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const entreeSouris = () => setIsHovering(true);
  const sortieSouris = () => setIsHovering(false);

  const mouvementSouris = (e) => {
    setMousePosition({ x: e.pageX, y: e.pageY });
  };

  function obtenirCouleurPourScore(score) {
    // Parcourir les paliers de score
    for (const palier of props.colors) {
      // Comparer le score avec le palier actuel
      if (score >= palier.score) {
        return palier.rgbHex; // Renvoie la couleur du palier correspondant
      }
    }
  
    // Si aucun score, attribuer une couleur par défaut
    return "#white"; 
  }

  return (
    <div>
      <div
        onMouseEnter={entreeSouris}
        onMouseLeave={sortieSouris}
        onMouseMove={mouvementSouris}
        style={{ color: obtenirCouleurPourScore(props.player.mythic_plus_scores_by_season[0].scores.all) }}
        className='page__table__content__line__name__div__scores'
      >
        Score : {parseInt(props.player.mythic_plus_scores_by_season[0].scores.all)}
      </div>

      {isHovering && (
        <div style={{
          position: 'absolute',
          left: mousePosition.x,
          top: mousePosition.y,
          pointerEvents: 'none',
        }}
            className='page__table__content__line__name__div__scores'
        >
            {props.player.mythic_plus_scores_by_season[0].scores.dps !== 0 &&
                <div style={{ color: obtenirCouleurPourScore(props.player.mythic_plus_scores_by_season[0].scores.dps) }} className='page__table__content__line__name__div__scores'>
                    <img src={dps} alt='dps' />
                    {parseInt(props.player.mythic_plus_scores_by_season[0].scores.dps)}
                </div>
            }
            {props.player.mythic_plus_scores_by_season[0].scores.tank !== 0 &&
                <div style={{ color: obtenirCouleurPourScore(props.player.mythic_plus_scores_by_season[0].scores.tank) }} className='page__table__content__line__name__div__scores'>
                    <img src={tank} alt='tank' />
                    {parseInt(props.player.mythic_plus_scores_by_season[0].scores.tank)}
                </div>
            }
            {props.player.mythic_plus_scores_by_season[0].scores.healer !== 0 &&
                <div style={{ color: obtenirCouleurPourScore(props.player.mythic_plus_scores_by_season[0].scores.healer) }} className='page__table__content__line__name__div__scores'>
                    <img src={heal} alt='heal' />
                    {parseInt(props.player.mythic_plus_scores_by_season[0].scores.healer)}
                </div>
            }
        </div>
      )}
    </div>
  );
}

export default Encart;
