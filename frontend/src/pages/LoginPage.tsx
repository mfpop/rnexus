import React from "react";
import { LoginRightCard } from "../components/auth";

/**
 * LoginPage - Login page that renders in the RIGHT CARD of StableLayout
 * This page uses the layout template WITHOUT affecting the layout itself
 * The content renders in the right card of the MainContainer
 * The left card shows login information (handled by StableLayout)
 *
 * Uses LoginRightCard with the login form
 */
const LoginPage: React.FC = () => {
  return <LoginRightCard />;
};

export default LoginPage;
