import React from 'react';
import { TouchableOpacity } from 'react-native';
import Logo from './Logo';
import * as S from './HeaderBar.styles'
import IconRenderer from './IconRenderer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HeaderBar: React.FC = () => {
    const insets = useSafeAreaInsets();

    return (
        <S.Container insets={insets}>
            <S.LogoWrapper>
                <Logo width={120} height={20} />
            </S.LogoWrapper>
            <TouchableOpacity onPress={() => { /* Handle profile press */ }}>
                <IconRenderer
                    family="materialIcons"
                    icon="account-circle"
                    fontSize={32}
                    color="primary"
                />
            </TouchableOpacity>
        </S.Container>
    );
};

export default HeaderBar;
