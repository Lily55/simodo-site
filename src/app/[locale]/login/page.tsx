import React from "react";

import { setRequestLocale } from "next-intl/server";
import styles from "./page.module.css";
import LoginForm from "../components/Forum/LoginForm";

const Login = async ({ params }: { params: { locale: string } }) => {
  const param = await params;
  const locale = param.locale;
  setRequestLocale(locale);
  return (
    <div className={styles.container}>
      <LoginForm locale={locale} />
    </div>
  );
};

export default Login;
