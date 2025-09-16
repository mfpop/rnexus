import React from "react";
import MainContainerTemplate from "../templates/MainContainerTemplate";
import LoginLeftCard from "./LoginLeftCard";
import LoginRightCard from "./LoginRightCard";

type ExpandedCardState = "left" | "right" | "left-full" | "right-full" | null;

interface LoginMainContainerProps {
  expandedCard?: ExpandedCardState;
  onExpandClick?: (side: "left" | "right") => void;
  className?: string;
}

/**
 * LoginMainContainer - Login page specific main container component
 * Based on MainContainerTemplate with independent content relationship
 * Left card: Security features and information
 * Right card: Login form
 */
const LoginMainContainer: React.FC<LoginMainContainerProps> = ({
  expandedCard,
  onExpandClick,
  className = "",
}) => {
  // Login page configuration
  const loginPageConfig = {
    leftTitle: "Secure Access",
    leftSubtitle: "Enterprise-grade security features",
    leftFooter: "Trusted by manufacturing leaders worldwide",
    rightTitle: "Sign In",
    rightSubtitle: "Access your Nexus LMD account",
    rightFooter: "Need help? Contact our support team",
  };

  return (
    <MainContainerTemplate
      // Use independent content relationship for login page
      contentRelationship="independent"
      // Left Card Configuration (Security Information)
      leftTitle={loginPageConfig.leftTitle}
      leftSubtitle={loginPageConfig.leftSubtitle}
      leftFooter={loginPageConfig.leftFooter}
      leftContent={<LoginLeftCard />}
      // Right Card Configuration (Login Form)
      rightTitle={loginPageConfig.rightTitle}
      rightSubtitle={loginPageConfig.rightSubtitle}
      rightFooter={loginPageConfig.rightFooter}
      rightContent={<LoginRightCard />}
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

export default LoginMainContainer;
