import { FC, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import * as S from './BottomBar.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RenderIcon from './RenderIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const USER_TABS = [
    { key: 'home', label: 'Home', family: 'foundation', icon: 'home' },
    { key: 'scan', label: 'Scan', family: 'entypo', icon: 'camera' },
    { key: 'tests', label: 'Tests', family: 'foundation', icon: 'results' },
    { key: 'more', label: 'More', family: 'feather', icon: 'more-horizontal' },
];

const DOCTOR_TABS = [
    { key: 'home', label: 'Home', family: 'foundation', icon: 'home' },
    { key: 'patients', label: 'Patients', family: 'ionIcons', icon: 'people' },
    { key: 'more', label: 'More', family: 'feather', icon: 'more-horizontal' },
];

const BottomBar: FC<BottomTabBarProps> = ({ state, navigation }) => {
    const insets = useSafeAreaInsets();
    const [userType, setUserType] = useState<string>('patient');

    useEffect(() => {
        AsyncStorage.getItem('userType').then(type => {
            if (type) setUserType(type);
        });
    }, []);

    const tabs = userType === 'doctor' ? DOCTOR_TABS : USER_TABS;

    return (
        <S.Container insets={insets}>
            {tabs.map((tab, idx) => {
                // Find the index of the tab in the navigation state
                const tabIndex = state.routes.findIndex(r => r.name.toLowerCase() === tab.key);
                const isActive = state.index === tabIndex;
                return (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => {
                            if (!isActive && tabIndex !== -1) {
                                navigation.navigate('Main', { screen: state.routes[tabIndex].name });
                            }
                        }}
                    >
                        <S.IconWrapper>
                            <RenderIcon
                                family={tab.family as any}
                                icon={tab.icon}
                                fontSize={24}
                                color={isActive ? 'primary' : 'themeGray'}
                            />
                            <S.Label isActive={isActive}>
                                {tab.label}
                            </S.Label>
                        </S.IconWrapper>
                    </TouchableOpacity>
                );
            })}
        </S.Container>
    );
};

export default BottomBar;
