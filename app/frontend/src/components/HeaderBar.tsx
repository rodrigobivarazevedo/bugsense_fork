import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Logo from './Logo';
import * as S from './HeaderBar.styles'
import RenderIcon from './RenderIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Home: undefined;
    Scan: undefined;
    Results: undefined;
    More: undefined;
    Account: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HeaderBar: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp>();

    return (
        <S.Container insets={insets}>
            <S.LogoWrapper>
                <Logo width={120} height={20} />
            </S.LogoWrapper>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    style={{ marginRight: 12 }}
                    onPress={() => { /* Handle notification press */ }}
                >
                    <RenderIcon
                        family="materialIcons"
                        icon="notifications"
                        fontSize={28}
                        color="primary"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Account')}>
                    <RenderIcon
                        family="materialIcons"
                        icon="account-circle"
                        fontSize={32}
                        color="primary"
                    />
                </TouchableOpacity>
            </View>
        </S.Container>
    );
};

export default HeaderBar;
