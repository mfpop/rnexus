import React from "react";
import { SystemRightCard } from "../components/system";

/**
 * SystemPage Component
 *
 * This page component uses the StableLayout architecture
 * It renders the SystemRightCard in the right card area
 * The SystemLeftCard is rendered by StableLayout based on the route
 */
const SystemPage: React.FC = () => {
  return <SystemRightCard />;
};

export default SystemPage;
