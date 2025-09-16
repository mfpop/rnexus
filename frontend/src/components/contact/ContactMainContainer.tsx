import React from "react";
import MainContainerTemplate from "../templates/MainContainerTemplate";
import ContactLeftCard from "./ContactLeftCard";
import ContactRightCard from "./ContactRightCard";

type ExpandedCardState = "left" | "right" | "left-full" | "right-full" | null;

interface ContactMainContainerProps {
  expandedCard?: ExpandedCardState;
  onExpandClick?: (side: "left" | "right") => void;
  className?: string;
}

/**
 * ContactMainContainer - Contact page specific main container component
 * Based on MainContainerTemplate with independent content relationship
 * Left card: Company contact information and support options
 * Right card: Contact form
 */
const ContactMainContainer: React.FC<ContactMainContainerProps> = ({
  expandedCard,
  onExpandClick,
  className = "",
}) => {
  // Contact page configuration
  const contactPageConfig = {
    leftTitle: "Get in Touch",
    leftSubtitle: "We're here to help you succeed",
    leftFooter: "Your trusted partner in manufacturing innovation",
    rightTitle: "Send us a Message",
    rightSubtitle: "Tell us how we can help",
    rightFooter: "© 2024 Nexus LMD. All rights reserved.",
  };

  return (
    <MainContainerTemplate
      // Use independent content relationship for contact page
      contentRelationship="independent"
      // Left Card Configuration (Contact Information)
      leftTitle={contactPageConfig.leftTitle}
      leftSubtitle={contactPageConfig.leftSubtitle}
      leftFooter={contactPageConfig.leftFooter}
      leftContent={<ContactLeftCard />}
      // Right Card Configuration (Contact Form)
      rightTitle={contactPageConfig.rightTitle}
      rightSubtitle={contactPageConfig.rightSubtitle}
      rightFooter={contactPageConfig.rightFooter}
      rightContent={<ContactRightCard />}
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

export default ContactMainContainer;
