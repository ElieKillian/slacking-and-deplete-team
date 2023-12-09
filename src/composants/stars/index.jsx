
function Stars(props){

    const nbreStars = props;

    const stars = Array.from({ length: nbreStars.content }, (_, index) => (
        <>★</>
      ));

    return <div className="stars">{stars}</div>
};

export default Stars;