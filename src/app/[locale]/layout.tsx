import { routing } from "i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { Header } from "./components/Header/Header";

const SimodoFont = localFont({ src: "../fonts/ShareTechMonoRegular.ttf" });

export default async function AllLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();

  setRequestLocale(locale);

  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
        }}
        className={SimodoFont.className}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
