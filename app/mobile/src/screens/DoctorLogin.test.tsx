import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DoctorLogin from './DoctorLogin';
import Api from '../api/Client';

jest.mock('@react-navigation/native-stack', () => ({
    NativeStackNavigationProp: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: { [key: string]: string } = {
                'error': 'Error',
                'failed_to_load_institutions': 'Failed to load institutions',
                'please_select_an_institution': 'Please select an institution',
                'please_fill_in_all_fields': 'Please fill in all fields',
                'login_failed': 'Login failed',
                'select_institution': 'Select institution',
                'loading_institutions': 'Loading institutions...',
                'doctor_id': 'Doctor ID',
                'enter_your_password': 'Enter your password',
                'login_as_doctor': 'Login as Doctor',
                'are_you_a_patient': 'Are you a patient?',
                'login_as_patient': 'Login as patient',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../api/Client', () => ({
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
}));

jest.mock('../components/Logo', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'logo', ...props });
    });
});

jest.mock('../components/RenderIcon', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'render-icon', ...props });
    });
});

jest.mock('../components/LanguageSwitcher', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'language-switcher', ...props });
    });
});

const mockNavigation = {
    navigate: jest.fn(),
    dispatch: jest.fn(),
    navigateDeprecated: jest.fn(),
    preload: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(() => true),
    canGoBack: jest.fn(() => true),
    getId: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(),
    setParams: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
} as any;

const mockInstitutions = [
    { id: 1, name: 'Hospital A', email: 'hospitala@test.com', phone: '123-456-7890' },
    { id: 2, name: 'Clinic B', email: 'clinicb@test.com', phone: '098-765-4321' },
    { id: 3, name: 'Medical Center C', email: 'medicalc@test.com', phone: '555-123-4567' },
];

const mockApi = Api as jest.Mocked<typeof Api>;

describe('DoctorLogin component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    });

    it('renders without crashing', () => {
        expect(() => render(<DoctorLogin navigation={mockNavigation} />)).not.toThrow();
    });

    it('renders all main components', () => {
        const { getByTestId } = render(<DoctorLogin navigation={mockNavigation} />);

        expect(getByTestId('logo')).toBeTruthy();
        expect(getByTestId('language-switcher')).toBeTruthy();
    });

    it('fetches institutions on mount', async () => {
        mockApi.get.mockResolvedValueOnce({ data: mockInstitutions });

        render(<DoctorLogin navigation={mockNavigation} />);

        await waitFor(() => {
            expect(mockApi.get).toHaveBeenCalledWith('institutions/');
        });
    });

    it('shows loading state while fetching institutions', async () => {
        mockApi.get.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: mockInstitutions }), 100)));

        const { getByText } = render(<DoctorLogin navigation={mockNavigation} />);

        expect(getByText('Loading institutions...')).toBeTruthy();
    });

    it('handles institution fetch error', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const alertSpy = jest.spyOn(Alert, 'alert');
        mockApi.get.mockRejectedValueOnce(new Error('Network error'));

        render(<DoctorLogin navigation={mockNavigation} />);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Error', 'Failed to load institutions');
        });

        consoleSpy.mockRestore();
    });

    it('updates doctor ID input', async () => {
        const { getByPlaceholderText } = await render(<DoctorLogin navigation={mockNavigation} />);

        const doctorIdInput = getByPlaceholderText('Doctor ID');
        fireEvent.changeText(doctorIdInput, 'DR123');

        expect(doctorIdInput.props.value).toBe('DR123');
    });

    it('updates password input', () => {
        const { getByPlaceholderText } = render(<DoctorLogin navigation={mockNavigation} />);

        const passwordInput = getByPlaceholderText('Enter your password');
        fireEvent.changeText(passwordInput, 'password123');

        expect(passwordInput.props.value).toBe('password123');
    });

    it('toggles password visibility', () => {
        const { getByPlaceholderText, getAllByTestId } = render(<DoctorLogin navigation={mockNavigation} />);

        const passwordInput = getByPlaceholderText('Enter your password');
        const visibilityIcons = getAllByTestId('render-icon');

        const passwordVisibilityIcon = visibilityIcons[visibilityIcons.length - 1];

        expect(passwordInput.props.secureTextEntry).toBe(true);

        fireEvent.press(passwordVisibilityIcon);

        expect(passwordInput.props.secureTextEntry).toBe(false);
    });

    it('navigates to patient login when patient link is pressed', () => {
        const { getByText } = render(<DoctorLogin navigation={mockNavigation} />);

        const patientLink = getByText('Login as patient');
        fireEvent.press(patientLink);

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });

    it('displays patient login prompt text', () => {
        const { getByText } = render(<DoctorLogin navigation={mockNavigation} />);

        expect(getByText('Are you a patient?')).toBeTruthy();
    });

    it('handles empty institutions list', async () => {
        mockApi.get.mockResolvedValueOnce({ data: [] });

        const { getByPlaceholderText, queryByText } = render(<DoctorLogin navigation={mockNavigation} />);

        await waitFor(() => {
            const institutionInput = getByPlaceholderText('Select institution');
            fireEvent(institutionInput, 'pressIn');
        });

        await waitFor(() => {
            expect(queryByText('Hospital A')).toBeFalsy();
            expect(queryByText('Clinic B')).toBeFalsy();
            expect(queryByText('Medical Center C')).toBeFalsy();
        });
    });
});
