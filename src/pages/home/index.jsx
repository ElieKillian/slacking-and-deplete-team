import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Stars from '../../composants/stars';
import rio from './Icon_FullColor.png';

function Home() {

    const [data, setData] = useState([]);
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
            const users = result.members;
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

        fetchDataForAllUsers();
      }, []); 
      
      console.log(data);

    if (loading) {
      return <p>Chargement en cours...</p>;
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
        <section>
          <div>
            <div className='page'>
              <h2>Récapitulatif des clés effectuées par chaque membre</h2>
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
                  {/* PLAYER 1 */}
                  <tr className='page__table__content__line'>
                    <td className='page__table__content__line__name'>
                      <img src={data[0]?.thumbnail_url} alt='player1' />
                      <div className='page__table__content__line__name__div'>
                        {data[0]?.name}
                        <Link to={data[0]?.profile_url} target='_blank'><img src={rio} alt='rio' /></Link> 
                      </div>
                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td className='page__table__content__line__key'>
                            {filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                <div>{filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.mythic_level || 0}</div>
                                <Stars content={filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                            {filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                <div>{filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.mythic_level || 0}</div>
                                <Stars content={filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                          </td>

                        {/* Tyrannical */}
                        <td className='page__table__content__line__key'>
                          {filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              <div>{filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.mythic_level || 0}</div>
                              <Stars content={filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.num_keystone_upgrades} />                              
                            </div>
                          }
                          {filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              <div>{filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.mythic_level || 0}</div>
                              <Stars content={filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 2 */}
                  <tr className='page__table__content__line'>
                    <td className='page__table__content__line__name'>
                      <img src={data[1]?.thumbnail_url} alt='player2' />
                      <div className='page__table__content__line__name__div'>
                        {data[1]?.name}
                        <Link to={data[1]?.profile_url} target='_blank'><img src={rio} alt='rio' /></Link> 
                      </div>
                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td className='page__table__content__line__key'>
                            {filterDungeons[1]?.[`dj${index}2`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                {filterDungeons[1]?.[`dj${index}2`]?.filterDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[1]?.[`dj${index}2`]?.filterDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                            {filterDungeons[1]?.[`dj${index}2`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                {filterDungeons[1]?.[`dj${index}2`]?.filterAltDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[1]?.[`dj${index}2`]?.filterAltDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                          </td>

                        {/* Tyrannical */}
                        <td className='page__table__content__line__key'>
                          {filterDungeons[1]?.[`dj${index}2`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[1]?.[`dj${index}2`]?.filterDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[1]?.[`dj${index}2`]?.filterDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                          {filterDungeons[1]?.[`dj${index}2`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[1]?.[`dj${index}2`]?.filterAltDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[1]?.[`dj${index}2`]?.filterAltDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 3 */}
                  <tr className='page__table__content__line'>
                    <td className='page__table__content__line__name'>
                      <img src={data[2]?.thumbnail_url} alt='player3' />
                      <div className='page__table__content__line__name__div'>
                        {data[2]?.name}
                        <Link to={data[2]?.profile_url} target='_blank'><img src={rio} alt='rio' /></Link> 
                      </div>                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td className='page__table__content__line__key'>
                            {filterDungeons[2]?.[`dj${index}3`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                {filterDungeons[2]?.[`dj${index}3`]?.filterDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[2]?.[`dj${index}3`]?.filterDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                            {filterDungeons[2]?.[`dj${index}3`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                {filterDungeons[2]?.[`dj${index}3`]?.filterAltDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[2]?.[`dj${index}3`]?.filterAltDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                          </td>

                        {/* Tyrannical */}
                        <td className='page__table__content__line__key'>
                          {filterDungeons[2]?.[`dj${index}3`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[2]?.[`dj${index}3`]?.filterDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[2]?.[`dj${index}3`]?.filterDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                          {filterDungeons[2]?.[`dj${index}3`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[2]?.[`dj${index}3`]?.filterAltDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[2]?.[`dj${index}3`]?.filterAltDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 4 */}
                  <tr className='page__table__content__line'>
                    <td className='page__table__content__line__name'>
                      <img src={data[3]?.thumbnail_url} alt='player4' />
                      <div className='page__table__content__line__name__div'>
                        {data[3]?.name}
                        <Link to={data[3]?.profile_url} target='_blank'><img src={rio} alt='rio' /></Link> 
                      </div>                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td className='page__table__content__line__key'>
                            {filterDungeons[3]?.[`dj${index}4`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                {filterDungeons[3]?.[`dj${index}4`]?.filterDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[3]?.[`dj${index}4`]?.filterDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                            {filterDungeons[3]?.[`dj${index}4`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                {filterDungeons[3]?.[`dj${index}4`]?.filterAltDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[3]?.[`dj${index}4`]?.filterAltDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                          </td>
                        {/* Tyrannical */}
                        <td className='page__table__content__line__key'>
                          {filterDungeons[3]?.[`dj${index}4`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[3]?.[`dj${index}4`]?.filterDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[3]?.[`dj${index}4`]?.filterDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                          {filterDungeons[3]?.[`dj${index}4`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[3]?.[`dj${index}4`]?.filterAltDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[3]?.[`dj${index}4`]?.filterAltDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 5 */}
                  <tr className='page__table__content__line'>
                    <td className='page__table__content__line__name'>
                      <img src={data[4]?.thumbnail_url} alt='player5' />
                      <div className='page__table__content__line__name__div'>
                        {data[4]?.name}
                        <Link to={data[4]?.profile_url} target='_blank'><img src={rio} alt='rio' /></Link> 
                      </div>                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                        <td className='page__table__content__line__key'>
                          {filterDungeons[4]?.[`dj${index}5`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[4]?.[`dj${index}5`]?.filterDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[4]?.[`dj${index}5`]?.filterDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                          {filterDungeons[4]?.[`dj${index}5`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[4]?.[`dj${index}5`]?.filterAltDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[4]?.[`dj${index}5`]?.filterAltDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                        </td>

                        {/* Tyrannical */}
                        <td className='page__table__content__line__key'>
                          {filterDungeons[4]?.[`dj${index}5`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[4]?.[`dj${index}5`]?.filterDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[4]?.[`dj${index}5`]?.filterDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                          {filterDungeons[4]?.[`dj${index}5`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[4]?.[`dj${index}5`]?.filterAltDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[4]?.[`dj${index}5`]?.filterAltDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 6 */}
                  <tr className='page__table__content__line'>
                    <td className='page__table__content__line__name'>
                      <img src={data[5]?.thumbnail_url} alt='player6' />
                      <div className='page__table__content__line__name__div'>
                        {data[5]?.name}
                        <Link to={data[5]?.profile_url} target='_blank'><img src={rio} alt='rio' /></Link> 
                      </div>
                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td className='page__table__content__line__key'>
                            {filterDungeons[5]?.[`dj${index}6`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                {filterDungeons[5]?.[`dj${index}6`]?.filterDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[5]?.[`dj${index}6`]?.filterDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                            {filterDungeons[5]?.[`dj${index}6`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                {filterDungeons[5]?.[`dj${index}6`]?.filterAltDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[5]?.[`dj${index}6`]?.filterAltDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                          </td>

                        {/* Tyrannical */}
                        <td className='page__table__content__line__key'>
                          {filterDungeons[5]?.[`dj${index}6`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[5]?.[`dj${index}6`]?.filterDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[5]?.[`dj${index}6`]?.filterDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                          {filterDungeons[5]?.[`dj${index}6`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[5]?.[`dj${index}6`]?.filterAltDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[5]?.[`dj${index}6`]?.filterAltDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 7 */}
                  <tr style={{ display: 'none' }} className='page__table__content__line'>
                    <td className='page__table__content__line__name'>
                      <img src={data[6]?.thumbnail_url} alt='player7' />
                      <div className='page__table__content__line__name__div'>
                        {data[6]?.name}
                        <Link to={data[6]?.profile_url} target='_blank'><img src={rio} alt='rio' /></Link> 
                      </div>
                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                        <td className='page__table__content__line__key'>
                            {filterDungeons[6]?.[`dj${index}7`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                {filterDungeons[6]?.[`dj${index}7`]?.filterDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[6]?.[`dj${index}7`]?.filterDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                            {filterDungeons[6]?.[`dj${index}7`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <div className='page__table__content__line__key__content'>
                                {filterDungeons[6]?.[`dj${index}7`]?.filterAltDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[6]?.[`dj${index}7`]?.filterAltDungeon?.num_keystone_upgrades} />
                              </div>
                            }
                        </td>

                        {/* Tyrannical */}
                        <td className='page__table__content__line__key'>
                          {filterDungeons[6]?.[`dj${index}7`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[6]?.[`dj${index}7`]?.filterDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[6]?.[`dj${index}7`]?.filterDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                          {filterDungeons[6]?.[`dj${index}7`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <div className='page__table__content__line__key__content'>
                              {filterDungeons[6]?.[`dj${index}7`]?.filterAltDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[6]?.[`dj${index}7`]?.filterAltDungeon?.num_keystone_upgrades} />
                            </div>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );
    }

export default Home;
