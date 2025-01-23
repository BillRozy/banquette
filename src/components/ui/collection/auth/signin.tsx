import GoogleSignin from "./google-signin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../card";
import { useTranslations } from "next-intl";
import GithubSignin from "./github-signin";
import InstaSignin from "./instagram-signin";
import VkSignin from "./vk-signin";

export default function SignIn() {
  const t = useTranslations("SignIn");
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:grid grid-cols-2 gap-4 justify-items-stretch">
          <GoogleSignin></GoogleSignin>
          <GithubSignin></GithubSignin>
          <InstaSignin></InstaSignin>
          <VkSignin></VkSignin>
        </div>
      </CardContent>
    </Card>
  );
}
