import React from "react";
import vkIcon from "@/icons/vk/SVG/Grey/VK_logo_Grey_64x64.svg";
import OauthSigninForm from "./oauth-signin-form";

export default function VkSignin() {
  return <OauthSigninForm icon={vkIcon} provider="vk"></OauthSigninForm>;
}
