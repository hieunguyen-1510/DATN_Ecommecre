import React from "react";
import Collection from "./Collection";
import { assets } from "../assets/assets";

const WomenCollection = () => {
  return <Collection category="Women" banner={assets.womenFashion} />;
};

export default WomenCollection;