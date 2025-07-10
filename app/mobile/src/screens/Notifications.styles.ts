import { StyleSheet } from 'react-native';
import { themeColors } from '../theme/GlobalTheme';
import { rem } from '../utils/Responsive';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.white,
        paddingTop: rem(1.5),
    },
    contentContainer: {
        paddingHorizontal: rem(1),
        paddingBottom: rem(1.5),
    },
    notificationItem: {
        backgroundColor: '#f7f7f7',
        borderRadius: rem(0.5),
        padding: rem(1),
        marginBottom: rem(0.5),
        flexDirection: 'column',
        borderLeftWidth: rem(0.25),
        borderLeftColor: '#4CAF50',
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: rem(0.5),
    },
    notificationTitle: {
        fontSize: rem(1),
        fontWeight: 'bold',
        color: themeColors.primary,
        flex: 1,
    },
    notificationTime: {
        fontSize: rem(0.85),
        color: '#666',
    },
    notificationMessage: {
        fontSize: rem(0.9),
        color: themeColors.text,
        lineHeight: rem(1.3),
        marginBottom: rem(0.5),
    },
    noNotificationsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: rem(2),
    },
    noNotificationsText: {
        fontSize: rem(1.1),
        color: '#666',
        textAlign: 'center',
        lineHeight: rem(1.5),
    },
    notificationPatient: {
        marginTop: rem(0.5),
    },
    notificationPatientText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: rem(2),
    },
    errorText: {
        fontSize: rem(1),
        color: '#d32f2f',
        textAlign: 'center',
        lineHeight: rem(1.4),
    },
});
