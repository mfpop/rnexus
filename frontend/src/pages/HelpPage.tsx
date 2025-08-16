import React from "react";
import { HelpRightCard } from "../components/help";

/**
 * HelpPage Component
 *
 * This page component uses the StableLayout architecture
 * It renders the HelpRightCard in the right card area
 * The HelpLeftCard is rendered by StableLayout based on the route
 * The HelpProvider wrapping is handled by StableLayout
 */
const HelpPage: React.FC = () => {
  return <HelpRightCard />;
};

export default HelpPage;
