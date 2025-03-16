import MainTabLink from "@/app/ui/collection/tablink";
import { getTranslations } from "next-intl/server";
import {
  NavigationMenu,
  NavigationMenuList,
} from "../../../components/ui/navigation-menu";

export default async function NavBar() {
  const t = await getTranslations("NavBar");
  return (
    <NavigationMenu className="mx-auto">
      <NavigationMenuList>
        <MainTabLink href="/tables">{t("myTables")}</MainTabLink>
        <MainTabLink href="/dishes">{t("myDishes")}</MainTabLink>
        <MainTabLink href="/ingredients">{t("myIngredients")}</MainTabLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
