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
        width: '100%',
        alignItems: 'stretch',
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
    input: {
        flexWrap: 'wrap',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: rem(0.75),
        fontSize: rem(1),
        backgroundColor: '#fafafa',
    },
    openTestKitsListContainer: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
        width: '100%',
    },
    openTestKitsListText: {
        textAlign: 'center',
        color: '#888',
        marginVertical: 18,
        fontSize: rem(1),
    },
    openTestKitsList: {
        maxHeight: rem(12.5),
        width: '100%',
    },
    openTestKitListItem: {
        padding: rem(1),
        backgroundColor: '#F3F4F6',
        borderRadius: rem(1),
        marginBottom: rem(0.75),
        borderWidth: 0,
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
        width: '100%',
        alignSelf: 'stretch',
        minWidth: 0,
        flex: 1,
    },
    openTestKitListItemQRData: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: rem(1),
    },
    openTestKitListItemCreatedAt: {
        fontSize: rem(0.85),
        color: '#555',
        marginTop: rem(0.25),
    },
});
