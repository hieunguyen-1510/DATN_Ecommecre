import React from "react";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import LatestCollection from "../components/LatestCollection";
import NewsletterForm from "../components/NewsletterForm";
import BannerSlider from "../components/BannerSlider";

const Home = () => (
  <div className="container mx-auto px-4">
    <section className="mb-8">
      <BannerSlider />
    </section>
    <section className="mb-8">
      <LatestCollection />
    </section>
    <section className="mb-8">
      <BestSeller />
    </section>
    <section className="mb-8">
      <OurPolicy />
    </section>
    <section>
      <NewsletterForm />
    </section>
  </div>
);

export default Home;
