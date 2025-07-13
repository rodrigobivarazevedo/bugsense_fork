import { StyleSheet } from 'react-native';
import { themeColors } from '../../theme/GlobalTheme';
import { rem } from '../../utils/Responsive';

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
        width: '90%',
        alignItems: 'center',
        maxWidth: rem(25),
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
    inputContainer: {
        marginBottom: rem(1),
        gap: rem(0.25),
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: rem(0.75),
        fontSize: rem(1),
        backgroundColor: '#fafafa',
        color: themeColors.primary,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: rem(0.5),
    },
    errorText: {
        color: 'red',
        fontSize: rem(0.85),
        marginTop: rem(0.25),
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: '2%',
    },
    cancelButton: {
        padding: rem(1),
        width: '49%',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderRadius: rem(0.5),
    },
    confirmButton: {
        padding: rem(1),
        width: '49%',
        alignItems: 'center',
        borderRadius: rem(0.5),
    },
    buttonText: {
        color: themeColors.primary,
        fontWeight: 'bold',
    },
});
