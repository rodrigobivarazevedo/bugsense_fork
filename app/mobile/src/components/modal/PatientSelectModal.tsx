import { FC, useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { styles } from './Modal.styles';
import { themeColors } from '../../theme/GlobalTheme';
import Api from '../../api/Client';
import { useTranslation } from 'react-i18next';

interface Patient {
    id: number;
    email: string;
    full_name: string;
    gender: string;
    dob: string | null;
}

interface PatientSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (patient: Patient) => void;
}

const PatientSelectModal: FC<PatientSelectModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const { t } = useTranslation();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filtered, setFiltered] = useState<Patient[]>([]);
    const [search, setSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPatients = async () => {
        try {
            const response = await Api.get('doctor/patients/');
            return response.data;
        } catch (error) {
            console.error('Error fetching patients:', error);
            return [];
        }
    };

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setSelectedPatient(null);
            setSearch('');
            fetchPatients().then(patientList => {
                setPatients(patientList);
                setFiltered(patientList);
                setLoading(false);
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (!search) {
            setFiltered(patients);
        } else {
            const s = search.toLowerCase();
            setFiltered(patients.filter(patient =>
                patient.full_name.toLowerCase().includes(s) ||
                (patient.email && patient.email.toLowerCase().includes(s))
            ));
        }
    }, [search, patients]);

    const handleSelect = (patient: Patient) => {
        setSelectedPatient(patient);
    };

    const handleConfirm = () => {
        if (selectedPatient) {
            onConfirm(selectedPatient);
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
                        <Text style={styles.heading}>{t('select_patient')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('search_patients_by_name_or_email')}
                            value={search}
                            onChangeText={setSearch}
                        />
                        <View style={styles.openTestKitsListContainer} />
                        {loading ? (
                            <ActivityIndicator size="small" />
                        ) : filtered.length === 0 ? (
                            <Text style={styles.openTestKitsListText}>
                                {t('no_patients_found_please_check_your_patient_assignments')}
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
                                            selectedPatient?.id === item.id && {
                                                backgroundColor: themeColors.primary,
                                                borderWidth: 2,
                                                borderColor: themeColors.primary,
                                            }
                                        ]}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <Text style={[
                                            styles.openTestKitListItemQRData,
                                            selectedPatient?.id === item.id && { color: themeColors.white }
                                        ]}>
                                            {item.full_name}
                                        </Text>
                                        <Text style={[
                                            styles.openTestKitListItemCreatedAt,
                                            selectedPatient?.id === item.id && { color: themeColors.white }
                                        ]}>
                                            {`DOB: ${item.dob || '-'} | Gender: ${item.gender || '-'}`}
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
                            style={[styles.confirmButton, { opacity: selectedPatient ? 1 : 0.5 }]}
                            disabled={!selectedPatient}
                        >
                            <Text style={styles.buttonText}>{t('confirm')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default PatientSelectModal; 