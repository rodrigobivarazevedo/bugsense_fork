import { StyleSheet } from "react-native";
import { themeColors } from "../theme/GlobalTheme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    optionCard: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCard: {
        backgroundColor: themeColors.accent,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    optionDesc: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
    patientInfo: {
        backgroundColor: themeColors.accent,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    patientInfoText: {
        fontSize: 16,
        fontWeight: '600',
        color: themeColors.primary,
    },
    launchButton: {
        backgroundColor: themeColors.primary,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    launchButtonText: {
        color: themeColors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: themeColors.themeGray,
    },
});