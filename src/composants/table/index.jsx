import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Stars from '../../composants/stars';
import rio from './Icon_FullColor.png';


function Table(props){

    const content = props.content;
    const [data, setData] = useState([]);
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
            const response = await fetch ('./members.json');
            const result = await response.json();
            let users;
            if (content === 'roster') {
                users = result.members;
              } else if (content === 'alts') {
                users = result.alts;
              } else {
                throw new Error('Contenu non pris en charge : ' + content);
              }
            const promises = users.map(fetchDataForUser);
            const results = await Promise.all(promises);
            setData(results);
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
      
    if (loading) {
      return <p className='loader'>Chargement en cours...</p>;
    }

    if (error){
      return(<p>Erreur d'import des données !</p>)
    }

    const nameDungeons = data[0]?.mythic_plus_best_runs.map((item) => item.dungeon) || [];
    // attribuer chaque donjon à une const
    const dungeon = {};
    for (let i = 0; i < nameDungeons.length; i++) {
      dungeon["number" + (i + 1)] = nameDungeons[i];
      // Noms des variables => dungeon.number1
    }
    
    // Chercher les correspondances
    const filterDungeons = [];
    const dungeonNumbers = Object.keys(dungeon);

    for (let i = 0; i < data.length; i++) {
      const dungeonData = {};
      dungeonNumbers.forEach((number, index) => {
        const keyPrefix = `dj${index}`;
        dungeonData[`${keyPrefix}${i + 1}`] = {
          filterDungeon: data[i]?.mythic_plus_best_runs?.find(item => item.dungeon === dungeon[number]),
          filterAltDungeon: data[i]?.mythic_plus_alternate_runs?.find(item => item.dungeon === dungeon[number])
        };
      });
      filterDungeons.push(dungeonData);
    }

    return (
      <table className='page__table'>
        <thead className='page__table__header'>
          <tr>
            <th></th>
            {error === false ? (
                nameDungeons?.map((item, index) => (
                  <>
                    <th key={index} colSpan={2}>
                      {item} <br/>
                    </th>
                  </>
                ))) : (null)}
          </tr>
          <tr>
            <th></th>
            {error === false ? (
                nameDungeons?.map((item, index) => (
                  <>
                    <th key={index}><img src={'https://wow.zamimg.com/images/wow/icons/large/ability_toughness.jpg'} alt='Fortifié' /></th>
                    <th><img src={'https://wow.zamimg.com/images/wow/icons/large/achievement_boss_archaedas.jpg'} alt='Tyrannique' /></th>
                  </> 
                ))) : (null)}
          </tr>
        </thead>
        <tbody className='page__table__content'>
            {/* PLAYERS */}
            {data.map((player, playerIndex) => (
            <tr key={playerIndex} className='page__table__content__line'>
                <td className='page__table__content__line__name'>
                <img src={player.thumbnail_url} alt={player.name} />
                <div className='page__table__content__line__name__div'>
                    {player.name}
                    <Link to={player.profile_url} target='_blank'>
                    <img src={rio} alt='rio' />
                    </Link>
                    {player.mythic_plus_scores_by_season[0].scores.all}
                </div>
                </td>

                {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                <React.Fragment key={index}>
                    {/* Fortified */}
                    <td className='page__table__content__line__key'>
                    {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                        <div className='page__table__content__line__key__content'>
                        {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.mythic_level || 0}
                        <Stars content={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.num_keystone_upgrades} />
                        </div>
                    }
                    {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                        <div className='page__table__content__line__key__content'>
                        {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.mythic_level || 0}
                        <Stars content={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.num_keystone_upgrades} />
                        </div>
                    }
                    </td>

                    {/* Tyrannical */}
                    <td className='page__table__content__line__key'>
                    {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                        <div className='page__table__content__line__key__content'>
                        {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.mythic_level || 0}
                        <Stars content={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterDungeon?.num_keystone_upgrades} />
                        </div>
                    }
                    {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                        <div className='page__table__content__line__key__content'>
                        {filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.mythic_level || 0}
                        <Stars content={filterDungeons[playerIndex]?.[`dj${index}${playerIndex + 1}`]?.filterAltDungeon?.num_keystone_upgrades} />
                        </div>
                    }
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