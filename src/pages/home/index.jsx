import React, { useEffect, useState } from 'react';
import Stars from '../../composants/stars';

function Home() {

    const [data, setData] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchDataForUser = async (user) => {
          const url = `https://raider.io/api/v1/characters/profile?region=${user.region}&realm=${user.realm}&name=${user.name}&fields=mythic_plus_best_runs%2Cmythic_plus_alternate_runs`;
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
          }
        };
        
        fetchDataForAllUsers();
      }, []); 

    if (error){return(<p>Erreur d'import des données !</p>)}

    console.log('data :',data);

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

    console.log('filterDungeons',filterDungeons);

      return (
        <section>
          <div>
            <div className='page'>
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
                            <th key={index}>FOR</th>
                            <th>TYR</th>
                          </>
                        ))) : (null)}
                  </tr>
                </thead>
                <tbody className='page__table__content'>
                  {/* PLAYER 1 */}
                  <tr>
                    <td>
                      <img src={data[0]?.thumbnail_url} alt='player1' />
                      {data[0]?.name}
                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td>
                            {filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.num_keystone_upgrades} />
                              </>
                            }
                            {filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.mythic_level || 0}
                                <Stars content={filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.num_keystone_upgrades} />
                              </>
                            }
                          </td>

                        {/* Tyrannical */}
                        <td>
                          {filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[0]?.[`dj${index}1`]?.filterDungeon?.num_keystone_upgrades} />                              
                            </>
                          }
                          {filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.mythic_level || 0}
                              <Stars content={filterDungeons[0]?.[`dj${index}1`]?.filterAltDungeon?.num_keystone_upgrades} />
                            </>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 2 */}
                  <tr>
                    <td>
                      <img src={data[1]?.thumbnail_url} alt='player2' />
                      {data[1]?.name}
                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td>
                            {filterDungeons[1]?.[`dj${index}2`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[1]?.[`dj${index}2`]?.filterDungeon?.mythic_level || 0}
                              </>
                            }
                            {filterDungeons[1]?.[`dj${index}2`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[1]?.[`dj${index}2`]?.filterAltDungeon?.mythic_level || 0}
                              </>
                            }
                          </td>

                        {/* Tyrannical */}
                        <td>
                          {filterDungeons[1]?.[`dj${index}2`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[1]?.[`dj${index}2`]?.filterDungeon?.mythic_level || 0}
                            </>
                          }
                          {filterDungeons[1]?.[`dj${index}2`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[1]?.[`dj${index}2`]?.filterAltDungeon?.mythic_level || 0}
                            </>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 3 */}
                  <tr>
                    <td>
                      <img src={data[2]?.thumbnail_url} alt='player3' />
                      {data[2]?.name}
                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td>
                            {filterDungeons[2]?.[`dj${index}3`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[2]?.[`dj${index}3`]?.filterDungeon?.mythic_level || 0}
                              </>
                            }
                            {filterDungeons[2]?.[`dj${index}3`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[2]?.[`dj${index}3`]?.filterAltDungeon?.mythic_level || 0}
                              </>
                            }
                          </td>

                        {/* Tyrannical */}
                        <td>
                          {filterDungeons[2]?.[`dj${index}3`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[2]?.[`dj${index}3`]?.filterDungeon?.mythic_level || 0}
                            </>
                          }
                          {filterDungeons[2]?.[`dj${index}3`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[2]?.[`dj${index}3`]?.filterAltDungeon?.mythic_level || 0}
                            </>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 4 */}
                  <tr>
                    <td>
                      <img src={data[3]?.thumbnail_url} alt='player4' />
                      {data[3]?.name}
                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td>
                            {filterDungeons[3]?.[`dj${index}4`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[3]?.[`dj${index}4`]?.filterDungeon?.mythic_level || 0}
                              </>
                            }
                            {filterDungeons[3]?.[`dj${index}4`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[3]?.[`dj${index}4`]?.filterAltDungeon?.mythic_level || 0}
                              </>
                            }
                          </td>

                        {/* Tyrannical */}
                        <td>
                          {filterDungeons[3]?.[`dj${index}4`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[3]?.[`dj${index}4`]?.filterDungeon?.mythic_level || 0}
                            </>
                          }
                          {filterDungeons[3]?.[`dj${index}4`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[3]?.[`dj${index}4`]?.filterAltDungeon?.mythic_level || 0}
                            </>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 5 */}
                  <tr>
                    <td>
                      <img src={data[4]?.thumbnail_url} alt='player5' />
                      {data[4]?.name}
                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td>
                            {filterDungeons[4]?.[`dj${index}5`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[4]?.[`dj${index}5`]?.filterDungeon?.mythic_level || 0}
                              </>
                            }
                            {filterDungeons[4]?.[`dj${index}5`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[4]?.[`dj${index}5`]?.filterAltDungeon?.mythic_level || 0}
                              </>
                            }
                          </td>

                        {/* Tyrannical */}
                        <td>
                          {filterDungeons[4]?.[`dj${index}5`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[4]?.[`dj${index}5`]?.filterDungeon?.mythic_level || 0}
                            </>
                          }
                          {filterDungeons[4]?.[`dj${index}5`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[4]?.[`dj${index}5`]?.filterAltDungeon?.mythic_level || 0}
                            </>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 6 */}
                  <tr>
                    <td>
                      <img src={data[5]?.thumbnail_url} alt='player6' />
                      {data[5]?.name}
                    </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td>
                            {filterDungeons[5]?.[`dj${index}6`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[5]?.[`dj${index}6`]?.filterDungeon?.mythic_level || 0}
                              </>
                            }
                            {filterDungeons[5]?.[`dj${index}6`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[5]?.[`dj${index}6`]?.filterAltDungeon?.mythic_level || 0}
                              </>
                            }
                          </td>

                        {/* Tyrannical */}
                        <td>
                          {filterDungeons[5]?.[`dj${index}6`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[5]?.[`dj${index}6`]?.filterDungeon?.mythic_level || 0}
                            </>
                          }
                          {filterDungeons[5]?.[`dj${index}6`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[5]?.[`dj${index}6`]?.filterAltDungeon?.mythic_level || 0}
                            </>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* PLAYER 7 */}
                  <tr style={{ display: 'none' }}>
                    <td>{data[6]?.name}</td>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <React.Fragment key={index}>
                        {/* Fortified */}
                          <td>
                            {filterDungeons[6]?.[`dj${index}7`]?.filterDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[6]?.[`dj${index}7`]?.filterDungeon?.mythic_level || 0}
                              </>
                            }
                            {filterDungeons[6]?.[`dj${index}7`]?.filterAltDungeon?.affixes[0]?.name === 'Fortified' &&
                              <>
                                {filterDungeons[6]?.[`dj${index}7`]?.filterAltDungeon?.mythic_level || 0}
                              </>
                            }
                          </td>

                        {/* Tyrannical */}
                        <td>
                          {filterDungeons[6]?.[`dj${index}7`]?.filterDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[6]?.[`dj${index}7`]?.filterDungeon?.mythic_level || 0}
                            </>
                          }
                          {filterDungeons[6]?.[`dj${index}7`]?.filterAltDungeon?.affixes[0]?.name === 'Tyrannical' &&
                            <>
                              {filterDungeons[6]?.[`dj${index}7`]?.filterAltDungeon?.mythic_level || 0}
                            </>
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
