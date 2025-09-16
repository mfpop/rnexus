import React from "react";
import MainContainerTemplate from "../templates/MainContainerTemplate";
import ResetPasswordLeftCard from "./ResetPasswordLeftCard";
import ResetPasswordRightCard from "./ResetPasswordRightCard";

type ExpandedCardState = "left" | "right" | "left-full" | "right-full" | null;

interface ResetPasswordMainContainerProps {
  expandedCard?: ExpandedCardState;
  onExpandClick?: (side: "left" | "right") => void;
  className?: string;
}

/**
 * ResetPasswordMainContainer - Reset password page specific main container component
 * Based on MainContainerTemplate with independent content relationship
 * Left card: Security process and recovery information
 * Right card: Password reset form
 */
const ResetPasswordMainContainer: React.FC<ResetPasswordMainContainerProps> = ({
  expandedCard,
  onExpandClick,
  className = "",
}) => {
  // Reset password page configuration
  const resetPasswordPageConfig = {
    leftTitle: "Password Recovery",
    leftSubtitle: "Secure account recovery process",
    leftFooter: "Your security is our priority",
    rightTitle: "Reset Password",
    rightSubtitle: "Regain access to your account",
    rightFooter: "Need additional help? Contact support",
  };

  return (
    <MainContainerTemplate
      // Use independent content relationship for reset password page
      contentRelationship="independent"
      // Left Card Configuration (Security Information)
      leftTitle={resetPasswordPageConfig.leftTitle}
      leftSubtitle={resetPasswordPageConfig.leftSubtitle}
      leftFooter={resetPasswordPageConfig.leftFooter}
      leftContent={<ResetPasswordLeftCard />}
      // Right Card Configuration (Reset Form)
      rightTitle={resetPasswordPageConfig.rightTitle}
      rightSubtitle={resetPasswordPageConfig.rightSubtitle}
      rightFooter={resetPasswordPageConfig.rightFooter}
      rightContent={<ResetPasswordRightCard />}
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

export default ResetPasswordMainContainer;
