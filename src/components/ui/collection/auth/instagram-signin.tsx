import React from "react";
import instaIcon from "@/icons/instagram/Instagram_Glyph_White.svg";
import OauthSigninForm from "./oauth-signin-form";

export default function InstaSignin() {
  return (
    <OauthSigninForm icon={instaIcon} provider="instagram"></OauthSigninForm>
  );
}
