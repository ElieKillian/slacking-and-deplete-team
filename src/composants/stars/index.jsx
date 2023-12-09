
function Stars(props){

    const nbreStars = props;

    const stars = Array.from({ length: nbreStars.content }, (_, index) => (
        <>★</>
      ));

    return <div>{stars}</div>
};

export default Stars;