import { useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import RenderLottie from '../components/RenderLottie';
// import RenderIcon from '../components/RenderIcon';
import styles from './Home.module.css';

const Home: FC = () => {
    const { t } = useTranslation();
    const [userName, setUserName] = useState<string | null>(null);

    // useEffect(() => {
    //     Api.get('users/me/')
    //         .then((res: any) => setUserName(res.data.full_name))
    //         .catch((err: any) => console.error('Could not load profile', err));
    // }, []);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <p>THIS IS HOME</p>
                    <div className={styles.lottie}>
                        <RenderLottie
                            name="homeHello"
                            startFrame={0}
                            endFrame={150}
                        />
                    </div>
                </div>
                <h1 className={styles.userName}>{userName}</h1>
            </div>
        </div>
    );
};

export default Home;
