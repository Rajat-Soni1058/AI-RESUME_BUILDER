import React from 'react'
import Banner from '../components/home/banner';
import Hero from '../components/home/hero';
import Feature from '../components/home/feature';
import Testimonial from '../components/home/testimonial';
import CallToAction from '../components/home/CallTOAction';
import Footer from '../components/home/footer';

const Home=()=>{
    return(
    <div>
        <h1>
           <Banner/>
           <Hero/>
           <Feature/>
           <Testimonial/>
           <CallToAction/>
           <Footer/>
        </h1>
    </div>
    )

}
export default Home;