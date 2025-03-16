"use server";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import SidebarLink from "./sidebar-link";
import { MenuIcon, RefrigeratorIcon, SoupIcon } from "lucide-react";
import NavUser from "./auth/nav-user";
import { auth } from "@/app/auth";
import { getTranslations } from "next-intl/server";

export async function AppSidebar() {
  const [t, l, session] = await Promise.all([
    getTranslations("Components.AppSidebar"),
    getTranslations("Links"),
    auth(),
  ]);
  const isSignedOn = session?.user != null;

  const items = [
    {
      title: l("menus"),
      href: "/menus",
      icon: <MenuIcon size={48}></MenuIcon>,
      items: isSignedOn
        ? [
            {
              title: "Создать",
              href: "/menus/create",
            },
          ]
        : [],
    },
    {
      title: l("dishes"),
      href: "/dishes",
      icon: <SoupIcon size={48}></SoupIcon>,
      items: isSignedOn
        ? [
            {
              title: "Создать",
              href: "/dishes/create",
            },
          ]
        : [],
    },
    {
      title: l("ingredients"),
      href: "/ingredients",
      icon: <RefrigeratorIcon size={48}></RefrigeratorIcon>,
      items: isSignedOn
        ? [
            {
              title: "Создать",
              href: "/ingredients/create",
            },
          ]
        : [],
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
                  {item.items != null && (
                    <SidebarMenuSub>
                      {item.items.map((subitem) => (
                        <SidebarMenuSubItem key={subitem.title}>
                          <SidebarMenuSubButton asChild>
                            <SidebarLink
                              {...subitem}
                              className="capitalize pl-6"
                            ></SidebarLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
