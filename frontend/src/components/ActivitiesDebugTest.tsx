import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_ACTIVITIES } from "../graphql/activities";

const ActivitiesDebugTest: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ALL_ACTIVITIES, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  useEffect(() => {
    console.log("🔍 ActivitiesDebugTest - Data:", data);
    console.log("🔍 ActivitiesDebugTest - Loading:", loading);
    console.log("🔍 ActivitiesDebugTest - Error:", error);
  }, [data, loading, error]);

  if (loading) return <div>Loading activities...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const activities = data?.allActivities || [];

  return (
    <div>
      <h2>Activities Debug Test</h2>
      <p>Found {activities.length} activities</p>
      <ul>
        {activities.map((activity: any) => (
          <li key={activity.id}>
            {activity.title} - {activity.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivitiesDebugTest;
