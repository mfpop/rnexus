import React from "react";
import MainContainerTemplate from "../templates/MainContainerTemplate";
import HomeLeftCard from "./HomeLeftCard";
import HomeRightCard from "./HomeRightCard";

type ExpandedCardState = "left" | "right" | "left-full" | "right-full" | null;

interface HomeMainContainerProps {
  expandedCard?: ExpandedCardState;
  onExpandClick?: (side: "left" | "right") => void;
  className?: string;
}

/**
 * HomeMainContainer - Home page specific main container component
 * Based on MainContainerTemplate with home page configuration from home.md
 * Uses independent content relationship pattern for home page
 */
const HomeMainContainer: React.FC<HomeMainContainerProps> = ({
  expandedCard,
  onExpandClick,
  className = "",
}) => {
  // Home page configuration from home.md
  const homePageConfig = {
    title: "Quick Navigation",
    subtitle: "Access key platform features and modules",
    footer: "Welcome to your dashboard",
    rightTitle: "Welcome to Nexus LMD",
    rightSubtitle:
      "Your comprehensive platform for managing and monitoring your production environment",
    rightFooter: "© 2024 Nexus LMD. All rights reserved.",
  };

  return (
    <MainContainerTemplate
      // Use independent content relationship for home page
      contentRelationship="independent"
      // Left Card Configuration
      leftTitle={homePageConfig.title}
      leftSubtitle={homePageConfig.subtitle}
      leftFooter={homePageConfig.footer}
      leftContent={
        <HomeLeftCard
          leftTitle={homePageConfig.title}
          leftSubtitle={homePageConfig.subtitle}
          footer={homePageConfig.footer}
          expandedCard={expandedCard}
          onExpandClick={onExpandClick}
        />
      }
      // Right Card Configuration
      rightTitle={homePageConfig.rightTitle}
      rightSubtitle={homePageConfig.rightSubtitle}
      rightFooter={homePageConfig.rightFooter}
      rightContent={<HomeRightCard />}
      // Expansion State
      expandedCard={expandedCard}
      onExpandClick={onExpandClick}
      // Container Styling
      className={className}
      gap="gap-4"
      padding="p-4"
      // Custom 25/75 proportion for home page
      gridProportions="1fr 3fr"
    />
  );
};

export default HomeMainContainer;
