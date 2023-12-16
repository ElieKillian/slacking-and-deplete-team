
function Stars(props){

    const nbreStars = props;

    if (nbreStars.content === 0){
      
      return <div className="nothing">X</div>
      
    } else if (nbreStars.content > 0) {

      const stars = Array.from({ length: nbreStars.content }, (_, index) => (
          <>★</>
        ));

      return <div className="stars">{stars}</div>

    }
};

export default Stars;