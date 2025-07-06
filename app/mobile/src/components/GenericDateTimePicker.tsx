import { FC, useState } from 'react';
import { Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import * as S from './GenericDateTimePicker.styles';

interface GenericDateTimePickerProps {
    value: Date;
    visible: boolean;
    mode: 'date' | 'time' | 'datetime';
    maximumDate?: Date;
    minimumDate?: Date;
    onChange: (date: Date) => void;
    onCancel?: () => void;
}

const GenericDateTimePicker: FC<GenericDateTimePickerProps> = ({
    value,
    visible,
    mode,
    maximumDate,
    minimumDate,
    onChange,
    onCancel,
}) => {
    const [tempDate, setTempDate] = useState<Date>(value);
    const { t } = useTranslation();

    if (!visible) return null;

    if (Platform.OS === 'ios') {
        return (
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={onCancel}
            >
                <S.ModalOverlay onPress={onCancel}>
                    <S.ModalContent>
                        <DateTimePicker
                            value={tempDate}
                            mode={mode}
                            display="inline"
                            maximumDate={maximumDate}
                            minimumDate={minimumDate}
                            onChange={(_, d) => d && setTempDate(d)}
                        />
                        <S.ModalButtonRow>
                            <S.ModalButton onPress={onCancel} textOnly>
                                <S.ModalButtonText textOnly>{t('cancel')}</S.ModalButtonText>
                            </S.ModalButton>
                            <S.ModalButton onPress={() => { onChange(tempDate) }}>
                                <S.ModalButtonText>{t('ok_capital')}</S.ModalButtonText>
                            </S.ModalButton>
                        </S.ModalButtonRow>
                    </S.ModalContent>
                </S.ModalOverlay>
            </Modal>
        );
    }

    return (
        <DateTimePicker
            value={value}
            mode={mode}
            display="default"
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            onChange={(_, d) => d && onChange(d)}
        />
    );
};

export default GenericDateTimePicker;
