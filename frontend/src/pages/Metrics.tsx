import React from "react";
import { MetricsRightCard, useMetricsContext } from "../components/metrics";

/**
 * MetricsPage - Metrics page right-side content for StableLayout integration
 * This component renders only the right-side content as StableLayout handles the overall structure
 * Left-side content is handled by MetricsLeftCard in StableLayout
 * Uses MetricsContext to communicate with the left card
 */
const Metrics: React.FC = () => {
  const { selectedMetric } = useMetricsContext();
  return <MetricsRightCard selectedMetric={selectedMetric} />;
};

export default Metrics;
