import { StyleSheet } from 'react-native';

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
    uploadButton: {
        backgroundColor: '#1976d2',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8
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
