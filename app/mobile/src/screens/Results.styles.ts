import { StyleSheet } from 'react-native';
import { themeColors } from '../theme/GlobalTheme';
import { rem } from '../utils/Responsive';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.white,
        paddingTop: rem(1.5),
    },
    addButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'absolute',
        top: rem(0.5),
        right: rem(1),
        zIndex: 1000,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeColors.primary,
        borderRadius: rem(1.5),
        padding: rem(0.5),
    },
    addButtonIcon: {
        backgroundColor: themeColors.white,
        borderRadius: 999,
        width: rem(1.5),
        height: rem(1.5),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: rem(0.5),
        fontSize: rem(1.25),
        color: themeColors.primary,
    },
    addButtonText: {
        color: themeColors.white,
        fontWeight: 'bold',
        fontSize: rem(0.75),
    },
    contentContainer: {
        paddingHorizontal: rem(1),
        paddingBottom: rem(1.5),
    },
    sectionHeader: {
        fontSize: rem(1.1),
        fontWeight: 'bold',
        color: themeColors.primary,
        marginBottom: rem(0.5),
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    sectionHeaderSticky: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderBottomWidth: 1,
        borderBottomColor: themeColors.primary,
        marginBottom: rem(0.5),
    },
    listItemStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: rem(0.25),
    },
    statusIndicator: {
        width: rem(0.5),
        height: rem(0.5),
        borderRadius: rem(0.25),
        marginRight: rem(0.5),
    },
    statusIndicatorYellow: {
        backgroundColor: '#FFD600',
    },
    statusIndicatorGreen: {
        backgroundColor: '#4CAF50',
    },
    listItem: {
        backgroundColor: '#f7f7f7',
        borderRadius: rem(0.5),
        padding: rem(1),
        marginBottom: rem(0.5),
        flexDirection: 'column',
    },
    listItemTime: {
        fontSize: rem(0.95),
        color: '#666',
        marginBottom: rem(0.25),
    },
    listItemStatus: {
        fontSize: rem(0.95),
        color: themeColors.primary,
    },
    listItemPatient: {
        marginTop: rem(0.5),
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    listItemLabel: {
        fontWeight: 'bold',
        color: '#444',
        marginRight: rem(0.25),
    },
    listItemValue: {
        color: '#444',
        marginRight: rem(1),
    },
});
