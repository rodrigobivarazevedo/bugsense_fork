import { FC, useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    SectionList,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { styles } from './Patients.styles';
import Api from '../api/Client';
import RenderIcon from '../components/RenderIcon';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

interface Patient {
    id: number;
    email: string;
    full_name: string;
    gender: string;
    dob: string | null;
}

interface Section {
    title: string;
    data: Patient[];
}

function groupPatientsAZ(patients: Patient[]): Section[] {
    const groups: { [letter: string]: Patient[] } = {};
    patients.forEach(patient => {
        const letter = (patient.full_name?.[0] || '').toUpperCase();
        if (!groups[letter]) groups[letter] = [];
        groups[letter].push(patient);
    });
    return Object.keys(groups)
        .sort()
        .map(letter => ({
            title: letter,
            data: groups[letter].sort((a, b) => a.full_name.localeCompare(b.full_name))
        }));
}

const Patients: FC = () => {
    const navigation: any = useNavigation();
    const { t } = useTranslation();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filtered, setFiltered] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await Api.get('doctor/patients/');
            setPatients(response.data);
            setFiltered(response.data);
        } catch (err: any) {
            setError(t('failed_to_load_patients'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useFocusEffect(
        useCallback(() => {
            fetchPatients();
        }, [fetchPatients])
    );

    useEffect(() => {
        if (!search) {
            setFiltered(patients);
        } else {
            const s = search.toLowerCase();
            setFiltered(
                patients.filter(p =>
                    p.full_name.toLowerCase().includes(s) ||
                    (p.email && p.email.toLowerCase().includes(s))
                )
            );
        }
    }, [search, patients]);

    const sections = groupPatientsAZ(filtered);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#888" />
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>{t('failed_to_load_patients')}</Text>
            </View>
        );
    }

    const genderIndicator = (gender: string) => {
        if (gender?.toLowerCase() === 'male') {
            return (
                <View style={styles.genderIndicatorWrapper}>
                    <RenderIcon
                        family="ionIcons"
                        icon="male"
                        fontSize={20}
                        color="primary"
                    />
                    <Text style={styles.patientDetails}>{t('male')}</Text>
                </View>
            );
        }
        if (gender?.toLowerCase() === 'female') {
            return (
                <View style={styles.genderIndicatorWrapper}>
                    <RenderIcon
                        family="ionIcons"
                        icon="female"
                        fontSize={20}
                        color="primary"
                    />
                    <Text style={styles.patientDetails}>{t('female')}</Text>
                </View>
            );
        }
        if (gender?.toLowerCase() === 'other') {
            return (
                <View style={styles.genderIndicatorWrapper}>
                    <RenderIcon
                        family="fontAwesome6"
                        icon="genderless"
                        fontSize={20}
                        color="primary"
                    />
                    <Text style={styles.patientDetails}>{t('other')}</Text>
                </View>
            );
        }
        return null;
    };

    const handlePatientPress = (patient: Patient) => {
        navigation.navigate('ViewPatient', { patientId: patient.id });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder={t('search_patients')}
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                />
            </View>
            {sections.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>{t('no_patients_found')}</Text>
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={item => item.id.toString()}
                    stickySectionHeadersEnabled={true}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handlePatientPress(item)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.patientItem}>
                                <Text style={styles.patientName}>{item.full_name}</Text>
                                <View style={styles.patientDetailsContainer}>
                                    <Text style={styles.patientDetails}>
                                        {item.dob ? item.dob : t('dob_not_available')}
                                    </Text>
                                    {genderIndicator(item.gender)}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default Patients;
