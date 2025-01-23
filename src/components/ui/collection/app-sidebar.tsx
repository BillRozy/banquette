import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SidebarLink from "./sidebar-link";
import { MenuIcon, RefrigeratorIcon, SoupIcon } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import clsx from "clsx";
import { interSans } from "@/app/fonts";
import { useTranslations } from "next-intl";
import NavUser from "./auth/nav-user";
import { Suspense } from "react";

export function AppSidebar() {
  const t = useTranslations("Components.AppSidebar");
  const l = useTranslations("Links");

  const items = [
    {
      title: l("menus"),
      href: "/menus",
      icon: <MenuIcon></MenuIcon>,
    },
    {
      title: l("dishes"),
      href: "/dishes",
      icon: <SoupIcon></SoupIcon>,
    },
    {
      title: l("ingredients"),
      href: "/ingredients",
      icon: <RefrigeratorIcon></RefrigeratorIcon>,
    },
  ];
  return (
    <Sidebar variant="inset" collapsible="icon">
      {/* <SidebarHeader>
        <div className="flex gap-2 items-center justify-center p-4">
          <CookingPot size={32}></CookingPot>
          <span
            className={clsx(
              "self-end uppercase font-semibold text-xl tracking-widest",
              interSans.className
            )}
          >
            {t("brand")}
          </span>
        </div>
      </SidebarHeader> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("mainSection")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarLink {...item}></SidebarLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Suspense>
          <NavUser />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
