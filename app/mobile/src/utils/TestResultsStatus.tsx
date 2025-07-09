import { useTranslation } from 'react-i18next';

export const getTranslatedTestStatus = (status: string): string => {
    const { t } = useTranslation();

    const statusMap: { [key: string]: string } = {
        'ongoing': t('test_status_ongoing'),
        'preliminary_assessment': t('test_status_preliminary_assessment'),
        'ready': t('test_status_ready'),
        'closed': t('test_status_closed')
    };

    return statusMap[status] || status;
};
