import { FC, useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { styles } from './Modal.styles';
import { themeColors } from '../../theme/GlobalTheme';
import { formatDateTimeGerman } from '../../utils/DateTimeFormatter';
import Api from '../../api/Client';
import { useTranslation } from 'react-i18next';

interface TestKit {
    id: number;
    qr_data: string;
    created_at: string;
    status: string;
    user_id: number;
}

interface TestSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (qrData: string) => void;
    patientId: number;
}

const TestSelectModal: FC<TestSelectModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    patientId,
}) => {
    const { t } = useTranslation();
    const [testKits, setTestKits] = useState<TestKit[]>([]);
    const [filtered, setFiltered] = useState<TestKit[]>([]);
    const [search, setSearch] = useState('');
    const [selectedQr, setSelectedQr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPatientTestKits = async () => {
        try {
            const response = await Api.get(`qr-codes/list/?user_id=${patientId}`);
            return response.data.filter((kit: any) => kit.result_status !== 'closed');
        } catch (error) {
            console.error('Error fetching patient test kits:', error);
            return [];
        }
    };

    useEffect(() => {
        if (isOpen && patientId) {
            setLoading(true);
            setSelectedQr(null);
            setSearch('');
            fetchPatientTestKits().then(kits => {
                setTestKits(kits);
                setFiltered(kits);
                setLoading(false);
            });
        }
    }, [isOpen, patientId]);

    useEffect(() => {
        if (!search) {
            setFiltered(testKits);
        } else {
            const s = search.toLowerCase();
            setFiltered(testKits.filter(kit => kit.qr_data.toLowerCase().includes(s)));
        }
    }, [search, testKits]);

    const handleSelect = (qr: string) => {
        setSelectedQr(qr);
    };

    const handleConfirm = () => {
        if (selectedQr) {
            onConfirm(selectedQr);
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
                        <Text style={styles.heading}>{t('select_test_kit')}</Text>
                        <Text style={styles.messageSubtitle}>
                            {t('choose_which_test_kit_to_upload_the_picture_for')}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('search_test_kits_by_qr_data')}
                            value={search}
                            onChangeText={setSearch}
                        />
                        <View style={styles.openTestKitsListContainer} />
                        {loading ? (
                            <ActivityIndicator size="small" />
                        ) : filtered.length === 0 ? (
                            <Text style={styles.openTestKitsListText}>
                                {t('no_ongoing_test_kits_found_for_this_patient_please_scan_a_new_test_kit_first')}
                            </Text>
                        ) : (
                            <FlatList
                                data={filtered}
                                keyExtractor={item => item.id.toString()}
                                style={styles.openTestKitsList}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.openTestKitListItem,
                                            selectedQr === item.qr_data && {
                                                backgroundColor: themeColors.primary,
                                                borderWidth: 2,
                                                borderColor: themeColors.primary,
                                            }
                                        ]}
                                        onPress={() => handleSelect(item.qr_data)}
                                    >
                                        <Text style={[
                                            styles.openTestKitListItemQRData,
                                            selectedQr === item.qr_data && { color: themeColors.white }
                                        ]}>
                                            {item.qr_data}
                                        </Text>
                                        <Text style={[
                                            styles.openTestKitListItemCreatedAt,
                                            selectedQr === item.qr_data && { color: themeColors.white }
                                        ]}>
                                            Created at: {formatDateTimeGerman(item.created_at)}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>{t('cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirm}
                            style={[styles.confirmButton, { opacity: selectedQr ? 1 : 0.5 }]}
                            disabled={!selectedQr}
                        >
                            <Text style={styles.buttonText}>{t('confirm')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default TestSelectModal; 