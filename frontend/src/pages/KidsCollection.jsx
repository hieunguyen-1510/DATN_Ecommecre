import React from "react";
import Collection from "./Collection";
import { assets } from "../assets/assets";

const KidsCollection = () => {
  return <Collection category="Kids" banner={assets.kidsFashion} />;
};

export default KidsCollection;