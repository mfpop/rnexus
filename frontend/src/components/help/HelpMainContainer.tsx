import React, { useMemo } from "react";
import MainContainerTemplate from "../templates/MainContainerTemplate";
import HelpLeftCard from "./HelpLeftCard";
import HelpRightCard from "./HelpRightCard";
import { useHelpContext } from "./HelpContext";

interface HelpMainContainerProps {
  pageConfig: any;
  expandedCard: any;
  handleExpandClick: any;
}

const HelpMainContainer: React.FC<HelpMainContainerProps> = ({
  pageConfig,
  expandedCard,
  handleExpandClick,
}) => {
  const { selectedSection, selectedSubsection } = useHelpContext();

  // Dynamic title and subtitle based on context
  const dynamicTitle = useMemo(() => {
    const sectionTitles: Record<string, string> = {
      "getting-started": "Getting Started",
      navigation: "Navigation Guide",
      dashboard: "Dashboard Features",
      communication: "Team Communication",
      production: "Production Management",
      "project-management": "Project Management",
      activities: "Activity Management",
      "news-updates": "News & Updates",
      "system-admin": "System Administration",
      "account-settings": "Account & Settings",
      troubleshooting: "Troubleshooting",
      support: "Support & Contact",
    };
    return sectionTitles[selectedSection] || selectedSection;
  }, [selectedSection]);

  const dynamicSubtitle = useMemo(() => {
    const subsectionTitles: Record<string, string> = {
      welcome: "Welcome to Nexus LMD",
      "first-login": "First Login",
      "navigation-basics": "Navigation Basics",
      "dashboard-overview": "Dashboard Overview",
    };
    return selectedSubsection
      ? subsectionTitles[selectedSubsection] || selectedSubsection
      : "Step-by-step guides and tutorials";
  }, [selectedSubsection]);

  return (
    <MainContainerTemplate
      key="help"
      leftTitle={pageConfig.leftTitle}
      leftSubtitle={pageConfig.leftSubtitle}
      leftFooter={pageConfig.leftFooter}
      leftContent={<HelpLeftCard />}
      rightTitle={dynamicTitle}
      rightSubtitle={dynamicSubtitle}
      rightFooter="~5 min read • Beginner level"
      rightContent={<HelpRightCard />}
      expandedCard={expandedCard}
      onExpandClick={handleExpandClick}
      gridProportions="1fr 3fr"
      showThreeDots={true}
    />
  );
};

export default HelpMainContainer;
