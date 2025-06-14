import React from "react";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import LatestCollection from "../components/LatestCollection";
import BannerSlider from "../components/BannerSlider";
import NewsletterForm from "../components/NewsletterForm";

const Home = () => (
  <div className="w-full">
    <section className="mb-4 max-h-[80vh] overflow-hidden">
      <BannerSlider />
    </section>
    <section className="mb-4">
      <LatestCollection />
    </section>
    <section className="mb-4">
      <BestSeller />
    </section>
    <section className="mt-[-16px] mb-6">
      <OurPolicy />
    </section>
    <section>
      <NewsletterForm />
    </section>
  </div>
);

export default Home;

