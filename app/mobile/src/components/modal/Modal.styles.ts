import { StyleSheet } from "react-native";
import { themeColors } from "../../theme/GlobalTheme";
import { rem } from "../../utils/Responsive";

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: themeColors.white,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalBody: {
        padding: rem(1.25),
    },
    heading: {
        fontSize: rem(1.25),
        fontWeight: 'bold',
        marginBottom: rem(1),
        textAlign: 'center',
        color: themeColors.primary,
    },
    message: {
        fontSize: rem(1),
        color: '#444',
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        borderTopColor: '#e0e0e0',
        borderTopWidth: 1,
    },
    cancelButton: {
        borderRightWidth: 0.5,
        borderRightColor: '#e0e0e0',
        padding: rem(1),
        width: '50%',
        alignItems: 'center',
    },
    confirmButton: {
        borderLeftWidth: 0.5,
        borderLeftColor: '#e0e0e0',
        padding: rem(1),
        width: '50%',
        alignItems: 'center',
    },
    buttonText: {
        color: themeColors.primary,
        fontWeight: 'bold',
    },
});
