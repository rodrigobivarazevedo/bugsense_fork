import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Home.styles';
import RenderLottie from '../components/RenderLottie';
import RenderIcon from '../components/RenderIcon';
import { rem } from '../utils/Responsive';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  // TODO: get user name from API
  const userName = 'Jane Julian Vernonica Doe';

  return (
    <S.Root>
      <S.Header>
        <S.HeaderRow>
          <S.Greeting>Hello</S.Greeting>
          <S.Lottie>
            <RenderLottie
              name="homeHello"
              startFrame={0}
              endFrame={150}
            />
          </S.Lottie>
        </S.HeaderRow>
        <S.UserName>{userName}</S.UserName>
      </S.Header>
      <S.Grid>
        <S.Box>
          <S.BoxIcon>
            <RenderIcon
              family="materialCommunity"
              icon="format-list-checkbox"
              fontSize={rem(2.25)}
              color="primary"
            />
          </S.BoxIcon>
          <S.BoxLabel>Overviews</S.BoxLabel>
        </S.Box>
        <S.Box>
          <S.BoxIcon>
            <RenderIcon
              family="octicons"
              icon="light-bulb"
              fontSize={rem(2.25)}
              color="primary"
            />
          </S.BoxIcon>
          <S.BoxLabel>Discover</S.BoxLabel>
        </S.Box>
        <S.Box>
          <S.BoxIcon>
            <RenderIcon
              family="fontAwesome"
              icon="newspaper-o"
              fontSize={rem(2.25)}
              color="primary"
            />
          </S.BoxIcon>
          <S.BoxLabel>News</S.BoxLabel>
        </S.Box>
        <S.Box>
          <S.BoxIcon>
            <RenderIcon
              family="materialCommunity"
              icon="email-send-outline"
              fontSize={rem(2.25)}
              color="primary"
            />
          </S.BoxIcon>
          <S.BoxLabel>Contact Us</S.BoxLabel>
        </S.Box>
      </S.Grid>
    </S.Root>
  );
};

export default Home;
