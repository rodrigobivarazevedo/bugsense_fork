import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import * as S from './BottomBar.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import RenderIcon from './RenderIcon';

type TabConfig = {
    key: string;
    label: string;
    family: string;
    icon: string;
};

const TABS: TabConfig[] = [
    { key: 'home', label: 'Home', family: 'foundation', icon: 'home' },
    { key: 'scan', label: 'Scan', family: 'entypo', icon: 'camera' },
    { key: 'results', label: 'Results', family: 'foundation', icon: 'results' },
    { key: 'more', label: 'More', family: 'feather', icon: 'more-horizontal' },
];

const BottomBar: React.FC = () => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<string>('home');
    const navigation = useNavigation();
    const navigationState = useNavigationState(state => state);

    useEffect(() => {
        if (!navigationState?.routes?.length) return;
        const current = navigationState.routes[navigationState.index].name.toLowerCase();
        setActiveTab(TABS.some(t => t.key === current) ? current : '');
    }, [navigationState]);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        const routeName = key.charAt(0).toUpperCase() + key.slice(1);
        navigation.navigate(routeName as never);
    };

    return (
        <S.Container insets={insets}>
            {TABS.map(tab => (
                <TouchableOpacity
                    key={tab.key}
                    onPress={() => handleTabChange(tab.key)}
                >
                    <S.IconWrapper>
                        <RenderIcon
                            family={tab.family as any}
                            icon={tab.icon}
                            fontSize={24}
                            color={activeTab === tab.key ? 'primary' : 'themeGray'}
                        />
                        <S.Label isActive={activeTab === tab.key}>
                            {tab.label}
                        </S.Label>
                    </S.IconWrapper>
                </TouchableOpacity>
            ))}
        </S.Container>
    );
};

export default BottomBar;
