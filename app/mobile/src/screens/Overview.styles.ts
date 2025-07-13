import { StyleSheet } from 'react-native';
import { themeColors } from '../theme/GlobalTheme';
import { rem } from '../utils/Responsive';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.white,
        paddingTop: rem(1.5),
    },
    header: {
        paddingHorizontal: rem(1),
        marginBottom: rem(1),
    },
    headerSubtitle: {
        fontSize: rem(0.9),
        color: themeColors.themeGray,
        lineHeight: rem(1.3),
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: rem(1),
    },
    ongoingTestsSection: {
        marginBottom: rem(1.5),
    },
    sectionTitle: {
        fontSize: rem(1.1),
        fontWeight: 'bold',
        color: themeColors.primary,
        marginBottom: rem(0.75),
    },
    testCard: {
        backgroundColor: '#f7f7f7',
        borderRadius: rem(0.5),
        padding: rem(1),
        marginBottom: rem(0.75),
        borderLeftWidth: rem(0.25),
        borderLeftColor: themeColors.primary,
    },
    testCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: rem(0.5),
    },
    testCardTitle: {
        fontSize: rem(1),
        fontWeight: 'bold',
        color: themeColors.primary,
        flex: 1,
    },
    testCardTimeContainer: {
        alignItems: 'flex-end',
    },
    testCardTime: {
        fontSize: rem(0.85),
        color: themeColors.themeGray,
    },
    testCardDate: {
        fontSize: rem(0.8),
        color: '#999',
        marginBottom: rem(0.1),
    },
    testCardStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: rem(0.5),
    },
    statusIndicator: {
        width: rem(0.5),
        height: rem(0.5),
        borderRadius: rem(0.25),
        marginRight: rem(0.5),
    },
    statusIndicatorOngoing: {
        backgroundColor: '#FFD600',
    },
    statusIndicatorPreliminary: {
        backgroundColor: '#FF9800',
    },
    statusIndicatorReady: {
        backgroundColor: '#4CAF50',
    },
    statusText: {
        fontSize: rem(0.9),
        color: themeColors.primary,
        fontWeight: '500',
    },
    patientInfo: {
        marginTop: rem(0.5),
        paddingTop: rem(0.5),
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    patientInfoRow: {
        flexDirection: 'row',
        marginBottom: rem(0.25),
    },
    patientInfoLabel: {
        fontSize: rem(0.85),
        fontWeight: 'bold',
        color: themeColors.themeGray,
        width: rem(3),
    },
    patientInfoValue: {
        fontSize: rem(0.85),
        color: themeColors.text,
        flex: 1,
    },
    noTestsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: rem(2),
    },
    noTestsIcon: {
        fontSize: rem(4),
        color: themeColors.themeGray,
        marginBottom: rem(1),
    },
    noTestsTitle: {
        fontSize: rem(1.2),
        fontWeight: 'bold',
        color: themeColors.primary,
        marginBottom: rem(0.5),
        textAlign: 'center',
    },
    noTestsText: {
        fontSize: rem(1),
        color: themeColors.themeGray,
        textAlign: 'center',
        lineHeight: rem(1.4),
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
    retryButton: {
        marginTop: rem(1),
        backgroundColor: themeColors.primary,
        paddingHorizontal: rem(1.5),
        paddingVertical: rem(0.75),
        borderRadius: rem(0.5),
    },
    retryButtonText: {
        color: themeColors.white,
        fontSize: rem(0.9),
        fontWeight: 'bold',
    },
});
