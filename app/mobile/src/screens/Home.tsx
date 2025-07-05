import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Home.styles';
import RenderLottie from '../components/RenderLottie';
import RenderIcon from '../components/RenderIcon';
import { rem } from '../utils/Responsive';
import Api from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';

type GridItem = {
  key: string;
  label: string;
  family: string;
  icon: string;
  route?: string;
};

const GRID_ITEMS: GridItem[] = [
  { key: 'overviews', label: 'Overviews', family: 'materialCommunity', icon: 'format-list-checkbox' },
  { key: 'discover', label: 'Discover', family: 'octicons', icon: 'light-bulb', route: 'Discover' },
  { key: 'news', label: 'News', family: 'fontAwesome', icon: 'newspaper-o' },
  { key: 'contactUs', label: 'Contact Us', family: 'materialCommunity', icon: 'email-send-outline' },
];

export const Home: FC<any> = ({ navigation }) => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string>('');
  const [userType, setUserType] = useState<string>('patient');

  useEffect(() => {
    Api.get('users/me/')
      .then(res => setUserName(res.data.full_name))
      .catch(err => console.error('Could not load profile', err));

    AsyncStorage.getItem('userType').then(type => {
      if (type && typeof type === 'string') {
        setUserType(type);
      }
    });
  }, []);

  const handlePress = (route?: string) => {
    if (route) navigation.navigate(route);
  };

  const filteredGridItems = GRID_ITEMS.filter(item => {
    if (userType === 'doctor') {
      return item.key !== 'contactUs' && item.key !== 'news';
    }
    return true;
  });

  return (
    <S.Root>
      <S.Header>
        <S.HeaderRow>
          <S.Greeting>{t('hello')}</S.Greeting>
          <S.Lottie>
            <RenderLottie name="homeHello" startFrame={0} endFrame={150} />
          </S.Lottie>
        </S.HeaderRow>
        <S.UserName>{userName}</S.UserName>
      </S.Header>

      <S.Grid>
        {filteredGridItems.map(item => (
          <S.Box
            key={item.key}
            onPress={() => handlePress(item.route)}
            disabled={!item.route}
          >
            <S.BoxIcon>
              <RenderIcon
                family={item.family as any}
                icon={item.icon}
                fontSize={rem(2.25)}
                color="primary"
              />
            </S.BoxIcon>
            <S.BoxLabel>{item.label}</S.BoxLabel>
          </S.Box>
        ))}
      </S.Grid>
    </S.Root>
  );
};

export default Home;
