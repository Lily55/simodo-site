import { Header } from "../components/Header/Header";
import styles from "./page.module.css";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.bodyContainer}>
      <Header />
      {children}
    </div>
  );
}
