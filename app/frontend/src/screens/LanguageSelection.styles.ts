import { StyleSheet } from 'react-native';
import { themeColors } from '../theme/GlobalTheme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.white,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: themeColors.primary,
        marginBottom: 30,
        textAlign: 'center',
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: themeColors.white,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: themeColors.secondary,
    },
    languageButtonActive: {
        borderColor: themeColors.primary,
        borderWidth: 2,
    },
    languageText: {
        fontSize: 18,
        color: themeColors.primary,
        marginLeft: 10,
    },
});
