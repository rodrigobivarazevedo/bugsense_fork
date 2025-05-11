import { FC, ReactNode } from 'react';
import styles from './Root.module.css';

interface RootProps {
    children: ReactNode;
}

const Root: FC<RootProps> = ({ children }) => {
    return (
        <div className={styles.root}>
            {children}
        </div>
    );
};

export default Root;
