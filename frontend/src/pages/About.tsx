import React from "react";
import { AboutRightCard, useAboutContext } from "../components/about";

/**
 * About - Company information page right-side content for StableLayout integration
 * This component renders only the right-side content as StableLayout handles the overall structure
 * Left-side content is handled by AboutLeftCard in StableLayout
 * Uses AboutContext to communicate with the left card
 */
const About: React.FC = () => {
  return <AboutRightCard />;
};

export default About;
