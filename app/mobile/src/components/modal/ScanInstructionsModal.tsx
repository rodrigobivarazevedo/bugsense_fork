import { FC } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Modal.styles';

interface ScanInstructionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    scanType: 'qr-code' | 'test-strip' | 'upload-test-strip';
    onDismiss?: () => void;
}

const ScanInstructionsModal: FC<ScanInstructionsModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    scanType,
    onDismiss,
}) => {
    const getInstructionsList = () => {
        if (scanType === 'qr-code') {
            return {
                title: 'QR Code Scanning Instructions',
                subtitle: 'To scan a QR code:',
                instructions: [
                    'Make sure the QR code is clearly visible',
                    'Hold the camera close enough to capture the entire code',
                    'Ensure good lighting and avoid shadows',
                    'Keep the camera steady to avoid blurry images',
                    'The QR code should fill most of the screen',
                ],
            };
        } else if (scanType === 'test-strip') {
            return {
                title: 'Test Strip Scanning Instructions',
                subtitle: 'To scan a test strip:',
                instructions: [
                    'Place the test strip on a flat, well-lit surface',
                    'Hold the camera directly above the strip',
                    'Make sure the entire strip is visible in the frame',
                    'Ensure good lighting and avoid shadows',
                    'Keep the camera steady to avoid blurry images',
                    'The strip should be clearly focused and readable',
                ],
            };
        } else if (scanType === 'upload-test-strip') {
            return {
                title: 'Upload Test Strip Instructions',
                subtitle: 'To upload a test strip:',
                instructions: [
                    'Select a clear photo of the test strip from your gallery',
                    'Ensure the test strip is fully visible in the image',
                    'The photo should be well-lit and in focus',
                    'Avoid images with glare, shadows, or obstructions',
                    'Do not use edited or filtered images',
                    'If possible, use a recent photo taken under good lighting conditions',
                ],
            };
        }
        return {
            title: '',
            subtitle: '',
            instructions: [],
        };
    };

    // TODO: Verify look on Android
    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            onDismiss={onDismiss}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.modalBody}>
                        <Text style={styles.heading}>
                            {getInstructionsList().title}
                        </Text>
                        <Text style={styles.messageSubtitle}>
                            {getInstructionsList().subtitle}
                        </Text>
                        {getInstructionsList().instructions.map((item, idx) => (
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
                            <Text style={styles.buttonText}>Understood</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ScanInstructionsModal;
