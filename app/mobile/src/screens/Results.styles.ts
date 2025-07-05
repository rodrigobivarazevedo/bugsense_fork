import { StyleSheet } from 'react-native';
import { themeColors } from '../theme/GlobalTheme';
import { rem } from '../utils/Responsive';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.white,
        padding: rem(1.5),
    },
    sectionHeader: {
        fontSize: rem(1.1),
        fontWeight: 'bold',
        color: themeColors.primary,
        marginTop: rem(1.5),
        marginBottom: rem(0.5),
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
        color: themeColors.secondary,
        fontWeight: 'bold',
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
