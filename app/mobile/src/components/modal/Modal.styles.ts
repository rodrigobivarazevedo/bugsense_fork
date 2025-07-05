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
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: rem(0.5),
    },
    messageSubtitle: {
        fontSize: rem(1),
        color: '#444',
        marginBottom: rem(0.5),
    },
    bullet: {
        fontSize: rem(1),
        color: themeColors.primary,
        alignSelf: 'flex-start',
    },
    message: {
        fontSize: rem(1),
        color: '#444',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        borderTopColor: '#e0e0e0',
        borderTopWidth: 1,
    },
    buttonColumn: {
        flexDirection: 'column',
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
    selectionButton: {
        padding: rem(1.25),
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#e0e0e0',
    },
    buttonText: {
        color: themeColors.primary,
        fontWeight: 'bold',
    },
});
