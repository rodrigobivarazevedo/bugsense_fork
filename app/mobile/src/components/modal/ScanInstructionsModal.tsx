import { FC } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Modal.styles';

interface ScanInstructionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    scanType: 'qr-code' | 'test-strip';
}

const ScanInstructionsModal: FC<ScanInstructionsModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    scanType,
}) => {
    const getInstructions = () => {
        if (scanType === 'qr-code') {
            return "To scan a QR code:\n\n• Make sure the QR code is clearly visible\n• Hold the camera close enough to capture the entire code\n• Ensure good lighting and avoid shadows\n• Keep the camera steady to avoid blurry images\n• The QR code should fill most of the screen";
        } else {
            return "To scan a test strip:\n\n• Place the test strip on a flat, well-lit surface\n• Hold the camera directly above the strip\n• Make sure the entire strip is visible in the frame\n• Ensure good lighting and avoid shadows\n• Keep the camera steady to avoid blurry images\n• The strip should be clearly focused and readable";
        }
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.modalBody}>
                        <Text style={styles.heading}>
                            {scanType === 'qr-code' ? 'QR Code Scanning Instructions' : 'Test Strip Scanning Instructions'}
                        </Text>
                        <Text style={styles.message}>{getInstructions()}</Text>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
                            <Text style={styles.buttonText}>I Understand</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ScanInstructionsModal; 