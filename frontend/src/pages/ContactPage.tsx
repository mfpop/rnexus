import React from "react";
import { ContactRightCard } from "../components/contact";

/**
 * ContactPage - Contact page that renders in the RIGHT CARD of StableLayout
 * This page uses the layout template WITHOUT affecting the layout itself
 * The content renders in the right card of the MainContainer
 * The left card shows contact navigation (handled by StableLayout)
 *
 * Uses ContactRightCard with the contact form
 */
const ContactPage: React.FC = () => {
  return <ContactRightCard />;
};

export default ContactPage;
