import React from 'react';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Gallery from '../../composants/gallery';
import wl from './wl.png';
import rio from './rio.png';


function Home(){

    const [affixes, setAffixes] = useState([]);
    const [affixesIcons, setAffixesIcons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const videoIds = [
        'xmSMW30jf4M',
        'bdzEqWpwU9c',
        'nG7ouKgkwJE',
        'FqdO9dwz7tc'
      ];  

    useEffect(() => {

        const fetchAffixes = async () => {
            try {
              const response = await fetch ('https://raider.io/api/v1/mythic-plus/affixes?region=eu&locale=fr');
              const result = await response.json();
              setAffixes(result);
            } catch (error) {
              console.error('Erreur lors de la requête à Raider.io', error);
              setError(true);
            } finally {
              setLoading(false);
            }
          };

          const getIcons = async ()=>{
            try{
                const response = await fetch ('./affixes.json');
                const result = await response.json();
                setAffixesIcons(result);
            } catch {
                setError(true);
            }
        }

        fetchAffixes();
        getIcons();
    }, []);

    if (loading) {
        return <p>Chargement en cours...</p>;
    }
  
    if (error){
        return(<p>Erreur d'import des données !</p>)
    }

    const findIcon = {};
    for (let i = 0; i < affixes.affix_details.length; i++) {
        const affixName = affixes.affix_details[i].name;
        const matchingAffix = affixesIcons.find(item => item.name === affixName);

        if (matchingAffix) {
            findIcon[i + 1] = matchingAffix.icon;
        } else {
            findIcon[i + 1] = ''; 
        }
    }
      
    return (
        <section className="page">
            <h2>Bienvenue sur le site de la team !</h2>
            <div className="page__container">
                <div className="page__container__div">
                    <div className="page__container__div__card">
                        <h3>Affixes de la semaine :</h3>
                        <div className="page__container__div__card__content">
                            <div className="page__container__div__card__content__affixes">                             
                                <h4>{affixes.affix_details[0]?.name}</h4>                       
                                <img src={findIcon[1]} alt={affixes.affix_details[0]?.name} />
                            </div>
                            <div className="page__container__div__card__content__affixes">
                                <h4>{affixes.affix_details[1]?.name}</h4>
                                <img src={findIcon[2]} alt={affixes.affix_details[1]?.name} />
                            </div>
                            <div className="page__container__div__card__content__affixes">
                                <h4>{affixes.affix_details[2]?.name}</h4>
                                <img src={findIcon[3]} alt={affixes.affix_details[2]?.name} />                    
                            </div>   
                        </div>        
                    </div>
                    <div className="page__container__div__card">
                        <h3>Page Raider io :</h3>
                        <Link to='https://raider.io/fr/teams/eu/slacking-and-deplete' target='_blank'><img src={rio} alt='logs' /></Link>                    
                        <h3>Page warcraftlogs :</h3>
                        <Link to='https://www.warcraftlogs.com/guild/reports-list/714174' target='_blank'><img src={wl} alt='logs' /></Link>
                    </div>  
                </div>
                <div className="page__container__div">
                    <div className="page__container__div__card2">
                        <h3>Vidéos en ligne (by Ciramor) :</h3>
                        <Gallery content={videoIds} />
                    </div>
                </div>                  
            </div>  
        </section>
    )
};

export default Home;