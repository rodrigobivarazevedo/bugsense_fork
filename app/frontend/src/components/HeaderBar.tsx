import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Logo from './Logo';
import * as S from './HeaderBar.styles'
import RenderIcon from './RenderIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { rem } from '../utils/Responsive';

const MAIN_TABS = ['Home', 'Scan', 'Results', 'More'];

const HeaderBar: React.FC<any> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const isMainTab = MAIN_TABS.includes(route.name);

    return (
        <S.Container insets={insets}>
            {isMainTab ? (
                <>
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
                                fontSize={rem(1.75)}
                                color="primary"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
                            <RenderIcon
                                family="materialIcons"
                                icon="account-circle"
                                fontSize={rem(2)}
                                color="primary"
                            />
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ marginRight: rem(0.5) }}
                    >
                        <RenderIcon
                            family="ionIcons"
                            icon="chevron-back"
                            fontSize={rem(1.25)}
                            color="primary"
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: rem(1.25), color: '#000', fontWeight: '500' }}>
                        {route.name}
                    </Text>
                </View>
            )}
        </S.Container>
    );
};

export default HeaderBar;
