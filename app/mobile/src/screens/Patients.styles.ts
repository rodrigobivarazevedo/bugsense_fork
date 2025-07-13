import { StyleSheet } from 'react-native';
import { themeColors } from '../theme/GlobalTheme';
import { rem } from '../utils/Responsive';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.white,
    },
    searchBarContainer: {
        padding: rem(1),
        backgroundColor: themeColors.secondary,
    },
    searchBar: {
        backgroundColor: themeColors.white,
        borderRadius: rem(1),
        paddingHorizontal: rem(1),
        paddingVertical: rem(0.75),
        fontSize: rem(1),
        borderWidth: 1,
        borderColor: themeColors.primary,
    },
    sectionHeader: {
        fontSize: rem(1.1),
        fontWeight: 'bold',
        color: themeColors.primary,
        backgroundColor: themeColors.secondary,
        paddingVertical: rem(0.5),
        paddingHorizontal: rem(1),
    },
    patientItem: {
        backgroundColor: '#f7f7f7',
        borderRadius: rem(0.5),
        padding: rem(1),
        marginVertical: rem(0.5),
        marginHorizontal: rem(1),
    },
    patientName: {
        fontSize: rem(1.1),
        fontWeight: '600',
        color: themeColors.primary,
        marginBottom: rem(0.25),
    },
    patientDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: rem(0.75),
    },
    patientDetails: {
        fontSize: rem(0.95),
        color: themeColors.text,
    },
    genderIndicatorWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: rem(0.125),
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: rem(2),
    },
    emptyText: {
        fontSize: rem(1.1),
        color: themeColors.themeGray,
        textAlign: 'center',
    },
});
