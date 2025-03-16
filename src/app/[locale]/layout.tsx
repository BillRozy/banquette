import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { AppSidebar } from "@/app/ui/collection/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { interSans, interTight, montserrat } from "../fonts";
import PageLayout from "@/app/ui/collection/layout/page-layout";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
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
        className={`${interSans.variable} ${interTight.variable} ${montserrat.variable} ${montserrat.className} antialiased h-full w-full`}
      >
        <NextIntlClientProvider messages={messages}>
          <NuqsAdapter>
            {/* <header className="fixed h-20 bg-gray-400 w-full p-4 z-20"></header> */}
            <SidebarProvider>
              <Suspense>
                <AppSidebar />
              </Suspense>
              <SidebarInset>
                <PageLayout>{children}</PageLayout>
              </SidebarInset>
            </SidebarProvider>
            <footer>{drawer}</footer>
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
