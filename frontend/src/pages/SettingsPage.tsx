import React from "react";
import { SettingsRightCard } from "../components/settings";

/**
 * SettingsPage Component
 *
 * This page component uses the StableLayout architecture
 * It renders the SettingsRightCard in the right card area
 * The SettingsLeftCard is rendered by StableLayout based on the route
 */
const SettingsPage: React.FC = () => {
  return <SettingsRightCard />;
};

export default SettingsPage;
