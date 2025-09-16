import React from "react";
import { RegisterRightCard } from "../components/auth";

/**
 * RegisterPage - Register page that renders in the RIGHT CARD of StableLayout
 * This page uses the layout template WITHOUT affecting the layout itself
 * The content renders in the right card of the MainContainer
 * The left card shows registration information (handled by StableLayout)
 *
 * Uses RegisterRightCard with the registration form
 */
const RegisterPage: React.FC = () => {
  return <RegisterRightCard />;
};

export default RegisterPage;
