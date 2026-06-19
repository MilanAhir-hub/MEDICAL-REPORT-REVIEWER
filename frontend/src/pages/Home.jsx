import Hero from '../sections/Hero';
import Navbar from '../components/Navbar';
import FeaturesSection from '../sections/Features';
import BuildProcess from '../sections/BuildProcess';
import Testinomials from '../sections/Testinomials';
import Questions from '../sections/Questions';
import Footer from '../components/Footer';

const Home = () => {
    return (
       <>
       <Navbar/>
       <Hero/>
       <FeaturesSection/>
       <BuildProcess/>
       <Testinomials/>
       <Questions/>
       <Footer/>
       </>
    );
};  

export default Home;