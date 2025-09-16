import React from "react";
import {
  ProductionRightCard,
  useProductionContext,
} from "../components/production";

/**
 * ProductionPage - Production page right-side content for StableLayout integration
 * This component renders only the right-side content as StableLayout handles the overall structure
 * Left-side content is handled by ProductionLeftCard in StableLayout
 * Uses ProductionContext to communicate with the left card
 */
const ProductionPage: React.FC = () => {
  const { selectedLine } = useProductionContext();
  return <ProductionRightCard selectedLine={selectedLine} />;
};

export default ProductionPage;
