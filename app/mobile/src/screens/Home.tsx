import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Home.styles';
import RenderLottie from '../components/RenderLottie';
import RenderIcon from '../components/RenderIcon';
import { rem } from '../utils/Responsive';
import Api from '../api/Client';

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

export const Home: React.FC<any> = ({ navigation }) => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    Api.get('users/me/')
      .then(res => setUserName(res.data.full_name))
      .catch(err => console.error('Could not load profile', err));
  }, []);

  const handlePress = (route?: string) => {
    if (route) navigation.navigate(route);
  };

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
        {GRID_ITEMS.map(item => (
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
