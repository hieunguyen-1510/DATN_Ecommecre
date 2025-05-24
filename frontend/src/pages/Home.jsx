import React from "react";
import HeroSection from "../components/HeroSection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import LatestCollection from "../components/LatestCollection";
import NewsletterForm from "../components/NewsletterForm";

const Home = () => (
  <div className="bg-[#fafbfc]">
    <section className="mb-12">
      <HeroSection />
    </section>
    <section className="mb-12">
      <BestSeller />
    </section>
    <section className="mb-12">
      <LatestCollection />
    </section>
    <section className="mb-12">
      <OurPolicy />
    </section>
     <section> 
      <NewsletterForm />
    </section>
  </div>
);

export default Home;
