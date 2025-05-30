import React from "react";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import LatestCollection from "../components/LatestCollection";
import NewsletterForm from "../components/NewsletterForm";
import BannerSlider from "../components/BannerSlider";

const Home = () => (
  <div className="bg-[#fafbfc]">
    <section className="mb-12">
      <BannerSlider />
    </section>
     <section className="mb-12">
      <LatestCollection />
    </section>
    <section className="mb-12">
      <BestSeller />
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
