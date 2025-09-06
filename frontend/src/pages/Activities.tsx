import React from "react";
import {
  ActivitiesRightCard,
  useActivities,
} from "../components/activities";

/**
 * ActivitiesPage - Activities page right-side content for StableLayout integration
 * This component renders only the right-side content as StableLayout handles the overall structure
 * Left-side content is handled by ActivitiesLeftCard in StableLayout
 * Uses ActivitiesContext to communicate with the left card
 */
const Activities: React.FC = () => {
  const { selectedActivity } = useActivities();
  return <ActivitiesRightCard selectedActivity={selectedActivity} />;
};

export default Activities;
