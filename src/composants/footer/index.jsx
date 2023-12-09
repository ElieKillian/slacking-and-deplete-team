function Footer(){

    const currentYear = new Date().getFullYear()

    return(
        <footer>
            <p>© Rafi - {currentYear}</p>
        </footer>
    )
};

export default Footer;