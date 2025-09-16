import React from "react";
import { ResetPasswordRightCard } from "../components/auth";

/**
 * ResetPasswordPage - Reset password page that renders in the RIGHT CARD of StableLayout
 * This page uses the layout template WITHOUT affecting the layout itself
 * The content renders in the right card of the MainContainer
 * The left card shows security information (handled by StableLayout)
 *
 * Uses ResetPasswordRightCard with the reset form
 */
const ResetPasswordPage: React.FC = () => {
  return <ResetPasswordRightCard />;
};

export default ResetPasswordPage;
