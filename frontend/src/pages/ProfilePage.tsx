import React from "react";
import { ProfileRightCard } from "../components/auth";

/**
 * ProfilePage - Profile page that renders in the RIGHT CARD of StableLayout
 * This page uses the layout template WITHOUT affecting the layout itself
 * The content renders in the right card of the MainContainer
 * The left card shows profile information (handled by StableLayout)
 *
 * Uses ProfileRightCard with the profile form
 */
const ProfilePage: React.FC = () => {
  return <ProfileRightCard />;
};

export default ProfilePage;
