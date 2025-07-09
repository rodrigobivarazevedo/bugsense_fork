import { FC, useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { styles } from './Modal.styles';
import { themeColors } from '../../theme/GlobalTheme';
import { formatDateTimeGerman } from '../../utils/DateTimeFormatter';

interface TestKit {
    id: number;
    qr_data: string;
    created_at: string;
    status: string;
}

interface TestKitSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (qrData: string) => void;
    fetchTestKits: () => Promise<TestKit[]>;
}

const TestKitSelectModal: FC<TestKitSelectModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    fetchTestKits,
}) => {
    const [testKits, setTestKits] = useState<TestKit[]>([]);
    const [filtered, setFiltered] = useState<TestKit[]>([]);
    const [search, setSearch] = useState('');
    const [selectedQr, setSelectedQr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setSelectedQr(null);
            setSearch('');
            fetchTestKits().then(kits => {
                setTestKits(kits);
                setFiltered(kits);
                setLoading(false);
            });
        }
    }, [isOpen]);

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
                        <Text style={styles.heading}>Select Test Kit</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Search test kits by QR data..."
                            value={search}
                            onChangeText={setSearch}
                        />
                        <View style={styles.openTestKitsListContainer} />
                        {loading ? (
                            <ActivityIndicator size="small" />
                        ) : filtered.length === 0 ? (
                            <Text style={styles.openTestKitsListText}>
                                No ongoing test kits found. Please scan a new test kit.
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
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirm}
                            style={[styles.confirmButton, { opacity: selectedQr ? 1 : 0.5 }]}
                            disabled={!selectedQr}
                        >
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default TestKitSelectModal; 