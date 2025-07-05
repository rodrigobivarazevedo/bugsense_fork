import { FC } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Modal.styles';

interface ScanSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectQRCode: () => void;
    onSelectTestStrip: () => void;
}

const ScanSelectionModal: FC<ScanSelectionModalProps> = ({
    isOpen,
    onClose,
    onSelectQRCode,
    onSelectTestStrip,
}) => {
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
                        <Text style={styles.heading}>What would you like to scan?</Text>
                    </View>
                    <View style={styles.buttonColumn}>
                        <TouchableOpacity onPress={onSelectQRCode} style={styles.selectionButton}>
                            <Text style={styles.buttonText}>TEST KIT QR CODE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onSelectTestStrip} style={styles.selectionButton}>
                            <Text style={styles.buttonText}>TEST STRIP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ScanSelectionModal; 