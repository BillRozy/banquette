import React from "react";
import googleIcon from "@/icons/google.svg";
import OauthSigninForm from "./oauth-signin-form";

export default function GoogleSignin() {
  return (
    <OauthSigninForm icon={googleIcon} provider="google"></OauthSigninForm>
  );
}
