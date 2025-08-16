import React from "react";
import MainContainerTemplate from "../templates/MainContainerTemplate";
import RegisterLeftCard from "./RegisterLeftCard";
import RegisterRightCard from "./RegisterRightCard";

type ExpandedCardState = "left" | "right" | "left-full" | "right-full" | null;

interface RegisterMainContainerProps {
  expandedCard?: ExpandedCardState;
  onExpandClick?: (side: "left" | "right") => void;
  className?: string;
}

/**
 * RegisterMainContainer - Register page specific main container component
 * Based on MainContainerTemplate with independent content relationship
 * Left card: Platform benefits and features
 * Right card: Registration form
 */
const RegisterMainContainer: React.FC<RegisterMainContainerProps> = ({
  expandedCard,
  onExpandClick,
  className = "",
}) => {
  // Register page configuration
  const registerPageConfig = {
    leftTitle: "Join Nexus LMD",
    leftSubtitle: "Transform your manufacturing operations",
    leftFooter: "Trusted by manufacturing leaders worldwide",
    rightTitle: "Create Account",
    rightSubtitle: "Start your manufacturing transformation",
    rightFooter: "Join thousands of satisfied customers",
  };

  return (
    <MainContainerTemplate
      // Use independent content relationship for register page
      contentRelationship="independent"
      // Left Card Configuration (Platform Benefits)
      leftTitle={registerPageConfig.leftTitle}
      leftSubtitle={registerPageConfig.leftSubtitle}
      leftFooter={registerPageConfig.leftFooter}
      leftContent={<RegisterLeftCard />}
      // Right Card Configuration (Registration Form)
      rightTitle={registerPageConfig.rightTitle}
      rightSubtitle={registerPageConfig.rightSubtitle}
      rightFooter={registerPageConfig.rightFooter}
      rightContent={<RegisterRightCard />}
      // Expansion State
      expandedCard={expandedCard}
      onExpandClick={onExpandClick}
      // Container Styling
      className={className}
      gap="gap-6"
      padding="p-4"
    />
  );
};

export default RegisterMainContainer;
