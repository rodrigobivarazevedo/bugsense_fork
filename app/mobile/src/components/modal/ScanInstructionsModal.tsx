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
    const getInstructionsList = () => {
        if (scanType === 'qr-code') {
            return [
                'Make sure the QR code is clearly visible',
                'Hold the camera close enough to capture the entire code',
                'Ensure good lighting and avoid shadows',
                'Keep the camera steady to avoid blurry images',
                'The QR code should fill most of the screen',
            ];
        } else {
            return [
                'Place the test strip on a flat, well-lit surface',
                'Hold the camera directly above the strip',
                'Make sure the entire strip is visible in the frame',
                'Ensure good lighting and avoid shadows',
                'Keep the camera steady to avoid blurry images',
                'The strip should be clearly focused and readable',
            ];
        }
    };

    // TODO: Verify look on Android
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
                            {scanType === 'qr-code'
                                ? 'QR Code Scanning Instructions'
                                : 'Test Strip Scanning Instructions'
                            }
                        </Text>
                        <Text style={styles.messageSubtitle}>
                            To scan a {scanType === 'qr-code' ? 'QR code' : 'test strip'}:
                        </Text>
                        {getInstructionsList().map((item, idx) => (
                            <View
                                key={idx}
                                style={styles.messageContainer}
                            >
                                <Text style={styles.bullet}>{'\u2022'}</Text>
                                <Text style={styles.message}>{item}</Text>
                            </View>
                        ))}
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
