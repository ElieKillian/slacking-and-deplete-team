import React from 'react';
import Table from '../../composants/table';

function Home() {
      return (
        <section>
          <div>
            <div className='page'>
              <h2>Récapitulatif des clés effectuées par chaque membre</h2>
              <Table content={'roster'} />
            </div>
          </div>
        </section>
      );
    }

export default Home;
