import { FC } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Logo from './Logo';
import * as S from './HeaderBar.styles'
import RenderIcon from './RenderIcon';
import NotificationIndicator from './NotificationIndicator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { rem } from '../utils/Responsive';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '../context/NotificationContext';

const MAIN_TABS = ['Home', 'Scan', 'Tests', 'Patients', 'More'];

const HeaderBar: FC<any> = ({ navigation, route, options, headerTitle }) => {
    const insets = useSafeAreaInsets();
    const isMainTab = MAIN_TABS.includes(route.name);
    const { t } = useTranslation();
    const { hasNotifications, refetch } = useNotificationContext();
    console.log('Mobile App has Notifications:', hasNotifications);

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
                            onPress={() => {
                                navigation.navigate('Notifications');
                                setTimeout(() => refetch(), 100);
                            }}
                        >
                            <NotificationIndicator
                                family="materialIcons"
                                icon="notifications"
                                fontSize={rem(1.75)}
                                color="primary"
                                hasNotifications={hasNotifications}
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
                        {t(headerTitle) || options?.headerTitle || route.name}
                    </Text>
                </View>
            )}
        </S.Container>
    );
};

export default HeaderBar;
