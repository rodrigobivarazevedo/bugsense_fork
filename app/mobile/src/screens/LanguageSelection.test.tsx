import { render, fireEvent } from '@testing-library/react-native';
import LanguageSelection from './LanguageSelection';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: { [key: string]: string } = {
                'select_language': 'Select Language',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../translations/i18n', () => ({
    language: 'en',
    changeLanguage: jest.fn(),
}));

const mockOnSelect = jest.fn();

jest.mock('../components/SimpleSelectPage', () => {
    return ({ title, options, selected, onSelect }: any) => {
        const { Text, TouchableOpacity } = require('react-native');

        mockOnSelect.mockImplementation(onSelect);

        return (
            <>
                <Text testID="title">{title}</Text>
                <Text testID="selected">{selected}</Text>
                {options.map((opt: any) => (
                    <Text key={opt.code} testID={`option-${opt.code}`}>{opt.name}</Text>
                ))}
                <TouchableOpacity testID="select-de" onPress={() => {
                    onSelect('de');
                    mockOnSelect('de');
                }}>
                    <Text>Select Deutsch</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="select-en" onPress={() => {
                    onSelect('en');
                    mockOnSelect('en');
                }}>
                    <Text>Select English</Text>
                </TouchableOpacity>
            </>
        );
    };
});

describe('LanguageSelection component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockOnSelect.mockClear();
    });

    it('renders with correct title, options, and selected language', () => {
        const { getByTestId } = render(<LanguageSelection />);
        expect(getByTestId('title').props.children).toBe('Select Language');
        expect(getByTestId('option-en').props.children).toBe('English');
        expect(getByTestId('option-de').props.children).toBe('Deutsch');
        expect(getByTestId('selected').props.children).toBe('en');
    });

    it('calls onSelect when a language is selected', () => {
        const { getByTestId } = render(<LanguageSelection />);

        expect(getByTestId('select-de')).toBeTruthy();
        expect(getByTestId('select-en')).toBeTruthy();

        fireEvent.press(getByTestId('select-de'));
        expect(mockOnSelect).toHaveBeenCalledWith('de');
        fireEvent.press(getByTestId('select-en'));
        expect(mockOnSelect).toHaveBeenCalledWith('en');
    });
});
