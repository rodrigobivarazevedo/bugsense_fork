import { FC, ReactNode } from "react";
import styles from "./Root.module.css";

interface RootProps {
  children: ReactNode;
}

const Root: FC<RootProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Root;
