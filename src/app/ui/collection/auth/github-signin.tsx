import React from "react";
import githubIcon from "@/icons/github/github-mark-white.svg";
import OauthSigninForm from "./oauth-signin-form";

export default function GithubSignin() {
  return (
    <OauthSigninForm icon={githubIcon} provider="github"></OauthSigninForm>
  );
}
