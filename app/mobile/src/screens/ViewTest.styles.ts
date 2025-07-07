import { StyleSheet } from 'react-native';
import { themeColors } from '../theme/GlobalTheme';

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#000',
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 16,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 8,
        color: '#000'
    },
    value: {
        marginBottom: 4,
        fontSize: 16,
        color: '#000'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#000'
    },
    placeholder: {
        color: '#aaa',
        marginBottom: 8
    },
    image: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 8
    },
    uploadButton: {
        backgroundColor: themeColors.primary,
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10
    },
    uploadButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        marginTop: 8
    },
    resultBox: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#eee'
    },
    resultLabel: {
        fontWeight: 'bold',
        marginTop: 4
    },
    resultValue: {
        fontWeight: 'normal'
    },
});
