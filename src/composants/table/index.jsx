import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Stars from '../../composants/stars';
import Loader from '../../composants/loader';
import rio from './Icon_FullColor.png';
import wow from './wow.png';
import dps from './dps.bmp';
import tank from './tank.bmp';
import heal from './heal.bmp';

function Table(props){

    const content = props.content;
    const [data, setData] = useState([]);
    const [colors, setColors] = useState([]);
    // const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchDataForUser = async (user) => {
          const url = `https://raider.io/api/v1/characters/profile?region=${user.region}&realm=${user.realm}&name=${user.name}&fields=mythic_plus_scores_by_season:current%2Cmythic_plus_best_runs%2Cmythic_plus_alternate_runs`;
          const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
    
          if (response.ok) {
            const result = await response.json();
            return result;
          } else {
            throw new Error('Erreur lors de la requête à Raider.io');
          }
        };
      
        const fetchDataForAllUsers = async () => {
          try {
            // obtenir la liste des joueurs dans le json
            const getDataMembers = await fetch ('./members.json');
            const getMembers = await getDataMembers.json();
            let users;
            // Voir si c'est tableau des main ou des alts, envoyer les données correspondantes
            if (content === 'roster') {
                users = getMembers.members;
              } else if (content === 'alts') {
                users = getMembers.alts;
              } else {
                throw new Error('Contenu non pris en charge : ' + content);
              }
            const promises = users.map(fetchDataForUser);
            // attendre le résultat des tous les fetchs des membres
            const results = await Promise.all(promises);
            // obtenir les couleurs Rio
            const getColors = await fetch('https://raider.io/api/v1/mythic-plus/score-tiers');
            const rioColors = await getColors.json();
            // Stocker tous les résultats
            setData(results);
            setColors(rioColors);
          } catch (error) {
            console.error('Une erreur s\'est produite :', error);
            setError(true);
          } finally {
            setLoading(false);
          }
        };

      // const getScore = async () => {
      //   const url = `https://raider.io/api/teams/name=slacking-and-deplete`;
      //   const response = await fetch(url, {
      //     method: 'GET',
      //     headers: { 'Content-Type': 'application/json' }
      //   });
  
      //   if (response.ok) {
      //     const result = await response.json();
      //     setTeam(result);
      //   } else {
      //     throw new Error('Erreur lors de la requête à Raider.io');
      //   }
      // };
      //   getScore();

        fetchDataForAllUsers();
      }, [content]); 

      // console.log(team);
      // console.log(data);
      // console.log(colors);
      
    if (loading) {
      return (
        <Loader />
      );
    }

    if (error){
      return(<p>Erreur d'import des données !</p>)
    }

    // Fonction : assignDungeonNumbers
    // Description : Cette fonction attribue un numéro à chaque donjon et les classe par ordre alphabétique.
    // Paramètre :
    //   - data : Liste de données contenant les donjons à numéroter et à classer
    // Retour : Un objet `dungeon` contenant les numéros de donjons associés à leur nom, classés par ordre alphabétique.

    const nameDungeons = data[0]?.mythic_plus_best_runs.map((item) => item.dungeon) || [];
    const dungeon = {};

    // Attribuer un numéro à chaque donjon et les classer par ordre alphabétique
    nameDungeons
      .sort() // Tri des noms de donjons par ordre alphabétique
      .forEach((name, index) => {
        dungeon[`number${index + 1}`] = name;
        // Noms des variables => dungeon.number1
      });


    // Fonction : filterDungeonsData
    // Description : Cette fonction cherche les correspondances entre les donjons d'une liste de données (`data`)
    //               et les numéros de donjons définis dans un objet (`dungeon`).
    //               Elle crée un tableau `filterDungeons` contenant des objets avec les données filtrées pour chaque donjon.
    // Paramètres :
    //   - data : Liste de données à filtrer (les données d'un joueur)
    //   - dungeon : Objet contenant les numéros de donjons associés à leur nom correspondant
    // Retour : Un tableau `filterDungeons` contenant les données filtrées pour chaque donjon.

    const filterDungeons = [];
    const dungeonNumbers = Object.keys(dungeon);

    for (let i = 0; i < data.length; i++) {
      const dungeonData = {};
      dungeonNumbers.forEach((number, index) => {
        const keyPrefix = `dj${index}`;
        dungeonData[`${keyPrefix}${i + 1}`] = {
          filterDungeon: data[i]?.mythic_plus_best_runs?.find(item => item.dungeon === dungeon[number]) ,
          filterAltDungeon: data[i]?.mythic_plus_alternate_runs?.find(item => item.dungeon === dungeon[number])
        };
      });
      filterDungeons.push(dungeonData);
    }

    // console.log(filterDungeons);

    function obtenirCouleurPourScore(score) {
      // Parcourir les paliers de score
      for (const palier of colors) {
        // Comparer le score avec le palier actuel
        if (score >= palier.score) {
          return palier.rgbHex; // Renvoie la couleur du palier correspondant
        }
      }
    
      // Si aucun score, attribuer une couleur par défaut
      return "#white"; 
    }

    return (
      <table className='page__table'>
        <thead className='page__table__header'>
          <tr>
            <th colSpan={1} s></th>
            {error === false && (
                nameDungeons?.map((item, index) => (
                  <>
                    <th key={index} colSpan={2}>
                      {item} <br/>
                    </th>
                  </>
                )))}
          </tr>
          <tr>
            <th></th>
            {error === false &&(
                nameDungeons?.map((item, index) => (
                  <>
                    <th key={index}><img src={'https://wow.zamimg.com/images/wow/icons/large/ability_toughness.jpg'} alt='Fortifié' /></th>
                    <th><img src={'https://wow.zamimg.com/images/wow/icons/large/achievement_boss_archaedas.jpg'} alt='Tyrannique' /></th>
                  </> 
                )))}
          </tr>
        </thead>
        <tbody className='page__table__content'>
            {/* PLAYERS */}
            {data.map((player, playerIndex) => (
            <tr key={playerIndex} className='page__table__content__line'>
                <td className='page__table__content__line__name'>
                  <div className='page__table__content__line__name__div'>
                    <img src={player.thumbnail_url} alt={player.name} />
                    {player.mythic_plus_scores_by_season[0].scores.all !== 0 &&
                        <div style={{ color: obtenirCouleurPourScore(player.mythic_plus_scores_by_season[0].scores.all) }} className='page__table__content__line__name__div__scores'>
                          {parseInt(player.mythic_plus_scores_by_season[0].scores.all)}
                        </div>
                      }
                  </div>
                  <div className='page__table__content__line__name__div'>
                      {player.name}
                      <div className='page__table__content__line__name__div__links'>
                        <Link to={player.profile_url} target='_blank'>
                          <img src={rio} alt='icone rio' />
                        </Link>
                        <Link to={`https://worldofwarcraft.blizzard.com/fr-fr/character/${player.region}/${player.realm.replace(/'/g, '').replace(/\s/g, '-')}/${player.name}`} target='_blank'>
                          <img src={wow} alt='icone wow' />
                        </Link>
                      </div>
                      {player.mythic_plus_scores_by_season[0].scores.dps !== 0 &&
                        <div style={{ color: obtenirCouleurPourScore(player.mythic_plus_scores_by_season[0].scores.dps) }} className='page__table__content__line__name__div__scores'>
                          <img src={dps} alt='dps' />
                          {parseInt(player.mythic_plus_scores_by_season[0].scores.dps)}
                        </div>
                      }
                      {player.mythic_plus_scores_by_season[0].scores.tank !== 0 &&
                        <div style={{ color: obtenirCouleurPourScore(player.mythic_plus_scores_by_season[0].scores.tank) }} className='page__table__content__line__name__div__scores'>
                          <img src={tank} alt='tank' />
                          {parseInt(player.mythic_plus_scores_by_season[0].scores.tank)}
                        </div>
                      }
                      {player.mythic_plus_scores_by_season[0].scores.healer !== 0 &&
                        <div style={{ color: obtenirCouleurPourScore(player.mythic_plus_scores_by_season[0].scores.healer) }} className='page__table__content__line__name__div__scores'>
                          <img src={heal} alt='heal' />
                          {parseInt(player.mythic_plus_scores_by_season[0].scores.healer)}
                        </div>
                      }
                  </div>
                </td>

                {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                <React.Fragment key={index}>
                    {/* Fortified */}
                    <td className='page__table__content__line__key'>
                      {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.affixes[0]?.name === 'Fortified' ? (
                        <div className='page__table__content__line__key__content'>
                          <Link to={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.url} target='_blank'>
                            {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.mythic_level || 0}
                          </Link>
                          <Stars content={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.num_keystone_upgrades} />
                        </div>
                      ) : filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' ? (
                        <div className='page__table__content__line__key__content'>
                          <Link to={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.url} target='_blank'>
                            {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.mythic_level || 0}
                          </Link>
                          <Stars content={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.num_keystone_upgrades} />
                        </div>
                      ) : (
                        <div className='nothing'>0</div>
                      )}
                    </td>


                    {/* Tyrannical */}
                    <td className='page__table__content__line__key'>
                      {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' ? (
                        <div className='page__table__content__line__key__content'>
                          <Link to={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.url} target='_blank'>
                            {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.mythic_level || 0}
                          </Link>
                          <Stars content={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.num_keystone_upgrades} />
                        </div>
                      ) : filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' ? (
                        <div className='page__table__content__line__key__content'>
                          <Link to={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.url} target='_blank'>
                            {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.mythic_level || 0}
                          </Link>
                          <Stars content={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.num_keystone_upgrades} />
                        </div>
                      ) : (
                        <div className='nothing'>0</div>
                      )}
                    </td>
                </React.Fragment>
                ))}
            </tr>
            ))}

        </tbody>
      </table>
    )
}

export default Table;