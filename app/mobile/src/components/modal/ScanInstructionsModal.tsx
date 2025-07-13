import { FC } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Modal.styles';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const getInstructionsList = () => {
        if (scanType === 'qr-code') {
            return {
                title: t('qr_scan_title'),
                subtitle: t('qr_scan_subtitle'),
                instructions: [
                    t('qr_scan_instruction_1'),
                    t('qr_scan_instruction_2'),
                    t('qr_scan_instruction_3'),
                    t('qr_scan_instruction_4'),
                    t('qr_scan_instruction_5'),
                ],
            };
        } else if (scanType === 'test-strip') {
            return {
                title: t('test_strip_scan_title'),
                subtitle: t('test_strip_scan_subtitle'),
                instructions: [
                    t('test_strip_scan_instruction_1'),
                    t('test_strip_scan_instruction_2'),
                    t('test_strip_scan_instruction_3'),
                    t('test_strip_scan_instruction_4'),
                    t('test_strip_scan_instruction_5'),
                    t('test_strip_scan_instruction_6'),
                ],
            };
        } else if (scanType === 'upload-test-strip') {
            return {
                title: t('upload_test_strip_title'),
                subtitle: t('upload_test_strip_subtitle'),
                instructions: [
                    t('upload_test_strip_instruction_1'),
                    t('upload_test_strip_instruction_2'),
                    t('upload_test_strip_instruction_3'),
                    t('upload_test_strip_instruction_4'),
                    t('upload_test_strip_instruction_5'),
                    t('upload_test_strip_instruction_6'),
                ],
            };
        }
        return {
            title: '',
            subtitle: '',
            instructions: [],
        };
    };

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
                            <Text style={styles.buttonText}>{t('cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
                            <Text style={styles.buttonText}>{t('understood')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ScanInstructionsModal;
