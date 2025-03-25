import { setRequestLocale } from "next-intl/server";
import React from "react";
import { DesktopHomepage } from "../components/DesktopHomepage/DesktopHomepage";

const Home = async ({ params }: { params: { locale: string } }) => {
  const param = await params;
  const locale = param.locale;
  setRequestLocale(locale);
  return (
    <div>
      <DesktopHomepage />
    </div>
  );
};

export default Home;
