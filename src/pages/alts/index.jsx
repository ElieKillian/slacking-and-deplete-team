import React from 'react';
import Table from '../../composants/table';

function Alts() {
      return (
        <section>
          <div>
            <div className='page'>
              <h2>Récapitulatif des clés effectuées par chaque reroll</h2>
              <Table content={'alts'} />
            </div>
          </div>
        </section>
      );
    }

export default Alts;