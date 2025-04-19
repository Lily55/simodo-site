import React from "react";

import { setRequestLocale } from "next-intl/server";
import styles from "./page.module.css";
import LoginAndRegistration from "../components/Forum/LoginAndRegistration";

const Login = async ({ params }: { params: { locale: string } }) => {
  const param = await params;
  const locale = param.locale;
  setRequestLocale(locale);
  return (
    <div className={styles.container}>
      <LoginAndRegistration locale={locale} />
    </div>
  );
};

export default Login;
