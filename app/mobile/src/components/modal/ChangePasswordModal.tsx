import { FC, useState, useEffect } from 'react';
import { Modal, TouchableOpacity, Alert, View, Text, TextInput, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { themeColors } from '../../theme/GlobalTheme';
import { styles } from './ChangePasswordModal.styles';
import RenderIcon from '../RenderIcon';
import Api from '../../api/Client';
import { validatePassword } from '../../utils/ValidatePassword';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChangePasswordModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ChangePasswordModal: FC<ChangePasswordModalProps> = ({ visible, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userFullName, setUserFullName] = useState('');

    const clearAllState = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
        setPasswordError('');
        setConfirmError('');
        setLoading(false);
        setUserEmail('');
        setUserFullName('');
    };

    const handleClose = () => {
        clearAllState();
        onClose();
    };

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    setUserEmail(user.email || '');
                    setUserFullName(user.full_name || '');
                }
            } catch (error) {
                console.error('Error getting user data from AsyncStorage:', error);
            }
        };

        if (visible) {
            getUserData();
        } else {
            clearAllState();
        }
    }, [visible]);

    const handleNewPasswordChange = (text: string) => {
        setNewPassword(text);
        setPasswordError(validatePassword(t, text, userEmail, userFullName));
        if (confirmPassword && text !== confirmPassword) {
            setConfirmError(t('Passwords do not match'));
        } else {
            setConfirmError('');
        }
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        if (text !== newPassword) {
            setConfirmError(t('Passwords do not match'));
        } else {
            setConfirmError('');
        }
    };

    const canSave =
        currentPassword &&
        newPassword &&
        confirmPassword &&
        !passwordError &&
        !confirmError;

    // TODO: Update to use correct API endpoint
    const handleSave = async () => {
        setLoading(true);
        try {
            await Api.post('users/change-password/', {
                old_password: currentPassword,
                new_password: newPassword,
            });
            setLoading(false);
            Alert.alert(t('Success'), t('Password changed successfully'));
            handleClose();
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setLoading(false);
            const message =
                err.response?.data?.detail ||
                err.response?.data?.non_field_errors?.[0] ||
                err.message;
            Alert.alert(t('Error'), message);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.modalBody}>
                        <Text style={styles.heading}>{t('Change Password')}</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('Enter current password')}
                                    placeholderTextColor={themeColors.primary}
                                    secureTextEntry={!showCurrent}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity style={styles.iconRow} onPress={() => setShowCurrent(v => !v)}>
                                    <RenderIcon
                                        family="materialIcons"
                                        icon={showCurrent ? 'visibility-off' : 'visibility'}
                                        fontSize={28}
                                        color={themeColors.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('Enter new password')}
                                    placeholderTextColor={themeColors.primary}
                                    secureTextEntry={!showNew}
                                    value={newPassword}
                                    onChangeText={handleNewPasswordChange}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity style={styles.iconRow} onPress={() => setShowNew(v => !v)}>
                                    <RenderIcon
                                        family="materialIcons"
                                        icon={showNew ? 'visibility-off' : 'visibility'}
                                        fontSize={28}
                                        color={themeColors.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('Confirm new password')}
                                    placeholderTextColor={themeColors.primary}
                                    secureTextEntry={!showConfirm}
                                    value={confirmPassword}
                                    onChangeText={handleConfirmPasswordChange}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity style={styles.iconRow} onPress={() => setShowConfirm(v => !v)}>
                                    <RenderIcon
                                        family="materialIcons"
                                        icon={showConfirm ? 'visibility-off' : 'visibility'}
                                        fontSize={28}
                                        color={themeColors.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                            {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleClose}
                                disabled={loading}
                            >
                                <Text style={styles.buttonText}>{t('Cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.confirmButton, { backgroundColor: canSave && !loading ? themeColors.primary : '#bdbdbd' }]}
                                onPress={handleSave}
                                disabled={!canSave || loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={themeColors.white} />
                                ) : (
                                    <Text style={[styles.buttonText, { color: canSave && !loading ? themeColors.white : '#f5f5f5' }]}>
                                        {t('Save')}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ChangePasswordModal;
