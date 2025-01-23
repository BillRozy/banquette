import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { AppSidebar } from "@/components/ui/collection/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { interSans, interTight } from "../fonts";
import PageLayout from "@/components/ui/collection/layout/page-layout";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
  };
}

export default async function LocaleLayout({
  children,
  drawer,
  params,
}: Readonly<{
  children: React.ReactNode;
  drawer: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  setRequestLocale(locale);
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale} className="m-0 h-screen w-full">
      <body
        className={`${interSans.variable} ${interTight.variable} ${interSans.className} antialiased h-full w-full`}
      >
        <NextIntlClientProvider messages={messages}>
          {/* <header className="fixed h-20 bg-gray-400 w-full p-4 z-20"></header> */}
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <PageLayout>{children}</PageLayout>
            </SidebarInset>
          </SidebarProvider>
          <footer>{drawer}</footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
