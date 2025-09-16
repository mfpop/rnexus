import React from "react";
import { HomeRightCard } from "../components/home";

/**
 * MainPage - Main dashboard page that renders in the RIGHT CARD of StableLayout
 * This page uses the layout template WITHOUT affecting the layout itself
 * The content renders in the right card of the MainContainer
 * The left card shows MainNavigation (handled by StableLayout)
 *
 * Uses HomeRightCard with the complete home page right content
 */
const MainPage: React.FC = () => {
  return <HomeRightCard />;
};

export default MainPage;
