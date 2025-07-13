import { render, fireEvent } from '@testing-library/react-native';
import SimpleSelectPage, { SimpleSelectOption } from './SimpleSelectPage';

jest.mock('./RenderIcon', () => {
    const React = require('react');
    return React.forwardRef(({ family, icon, fontSize, color, testID }: any, ref: any) => {
        return React.createElement('View', {
            ref,
            testID: testID || 'render-icon',
            family,
            icon,
            fontSize,
            color
        });
    });
});

describe('SimpleSelectPage component', () => {
    const mockOptions: SimpleSelectOption[] = [
        { code: 'en', name: 'English' },
        { code: 'de', name: 'Deutsch' },
        { code: 'fr', name: 'Français' },
        { code: 'es', name: 'Español' },
    ];

    const defaultProps = {
        title: 'Select Language',
        options: mockOptions,
        selected: 'en',
        onSelect: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing with default props', () => {
        expect(() => render(<SimpleSelectPage {...defaultProps} />)).not.toThrow();
    });

    it('renders the title correctly', () => {
        const { getByText } = render(<SimpleSelectPage {...defaultProps} />);
        const titleElement = getByText('Select Language');

        expect(titleElement).toBeTruthy();
    });

    it('renders all options', () => {
        const { getByText } = render(<SimpleSelectPage {...defaultProps} />);

        expect(getByText('English')).toBeTruthy();
        expect(getByText('Deutsch')).toBeTruthy();
        expect(getByText('Français')).toBeTruthy();
        expect(getByText('Español')).toBeTruthy();
    });

    it('renders the correct number of options', () => {
        const { getAllByText } = render(<SimpleSelectPage {...defaultProps} />);
        const optionElements = getAllByText(/English|Deutsch|Français|Español/);

        expect(optionElements).toHaveLength(4);
    });

    it('shows check icon for selected option', () => {
        const { getAllByTestId } = render(<SimpleSelectPage {...defaultProps} />);
        const icons = getAllByTestId('render-icon');

        expect(icons).toHaveLength(1);
    });

    it('does not show check icon for unselected options', () => {
        const { getAllByTestId } = render(
            <SimpleSelectPage {...defaultProps} selected="de" />
        );
        const icons = getAllByTestId('render-icon');

        expect(icons).toHaveLength(1);
    });

    it('calls onSelect when an option is pressed', () => {
        const onSelect = jest.fn();
        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} onSelect={onSelect} />
        );

        fireEvent.press(getByText('Deutsch'));

        expect(onSelect).toHaveBeenCalledWith('de');
    });

    it('calls onSelect with correct code for each option', () => {
        const onSelect = jest.fn();
        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} onSelect={onSelect} />
        );

        fireEvent.press(getByText('English'));
        expect(onSelect).toHaveBeenCalledWith('en');

        fireEvent.press(getByText('Français'));
        expect(onSelect).toHaveBeenCalledWith('fr');

        fireEvent.press(getByText('Español'));
        expect(onSelect).toHaveBeenCalledWith('es');
    });

    it('handles empty options array', () => {
        const { getByText, queryByTestId } = render(
            <SimpleSelectPage {...defaultProps} options={[]} />
        );

        expect(getByText('Select Language')).toBeTruthy();
        expect(queryByTestId('render-icon')).toBeNull();
    });

    it('handles single option', () => {
        const singleOption = [{ code: 'en', name: 'English' }];
        const { getByText, getAllByTestId } = render(
            <SimpleSelectPage {...defaultProps} options={singleOption} />
        );

        expect(getByText('English')).toBeTruthy();
        expect(getAllByTestId('render-icon')).toHaveLength(1);
    });

    it('handles options with special characters', () => {
        const specialOptions = [
            { code: 'zh', name: '中文' },
            { code: 'ja', name: '日本語' },
            { code: 'ko', name: '한국어' },
        ];

        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} options={specialOptions} />
        );

        expect(getByText('中文')).toBeTruthy();
        expect(getByText('日本語')).toBeTruthy();
        expect(getByText('한국어')).toBeTruthy();
    });

    it('handles options with numbers in names', () => {
        const numberOptions = [
            { code: 'v1', name: 'Version 1.0' },
            { code: 'v2', name: 'Version 2.0' },
        ];

        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} options={numberOptions} />
        );

        expect(getByText('Version 1.0')).toBeTruthy();
        expect(getByText('Version 2.0')).toBeTruthy();
    });

    it('handles options with long names', () => {
        const longNameOptions = [
            { code: 'long', name: 'This is a very long option name that might wrap to multiple lines' },
        ];

        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} options={longNameOptions} />
        );

        expect(getByText('This is a very long option name that might wrap to multiple lines')).toBeTruthy();
    });

    it('handles empty string title', () => {
        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} title="" />
        );

        expect(getByText('')).toBeTruthy();
    });

    it('handles long title', () => {
        const longTitle = 'This is a very long title that might need to wrap to multiple lines';
        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} title={longTitle} />
        );

        expect(getByText(longTitle)).toBeTruthy();
    });

    it('handles special characters in title', () => {
        const specialTitle = 'Select Language (Choose One) - Version 2.0';
        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} title={specialTitle} />
        );

        expect(getByText(specialTitle)).toBeTruthy();
    });

    it('handles no selected option', () => {
        const { queryByTestId } = render(
            <SimpleSelectPage {...defaultProps} selected="" />
        );

        expect(queryByTestId('render-icon')).toBeNull();
    });

    it('handles selected option that does not exist in options', () => {
        const { queryByTestId } = render(
            <SimpleSelectPage {...defaultProps} selected="nonexistent" />
        );

        expect(queryByTestId('render-icon')).toBeNull();
    });

    it('handles case-sensitive option codes', () => {
        const caseSensitiveOptions = [
            { code: 'EN', name: 'English' },
            { code: 'en', name: 'English (lowercase)' },
        ];

        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} options={caseSensitiveOptions} selected="EN" />
        );

        expect(getByText('English')).toBeTruthy();
        expect(getByText('English (lowercase)')).toBeTruthy();
    });

    it('handles options with same names but different codes', () => {
        const sameNameOptions = [
            { code: 'en-us', name: 'English' },
            { code: 'en-gb', name: 'English' },
        ];

        const { getAllByText } = render(
            <SimpleSelectPage {...defaultProps} options={sameNameOptions} />
        );

        const englishElements = getAllByText('English');
        expect(englishElements).toHaveLength(2);
    });

    it('handles options with empty names', () => {
        const emptyNameOptions = [
            { code: 'empty', name: '' },
            { code: 'normal', name: 'Normal' },
        ];

        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} options={emptyNameOptions} />
        );

        expect(getByText('')).toBeTruthy();
        expect(getByText('Normal')).toBeTruthy();
    });

    it('handles options with empty codes', () => {
        const emptyCodeOptions = [
            { code: '', name: 'Empty Code' },
            { code: 'normal', name: 'Normal' },
        ];

        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} options={emptyCodeOptions} />
        );

        expect(getByText('Empty Code')).toBeTruthy();
        expect(getByText('Normal')).toBeTruthy();
    });

    it('calls onSelect with empty string for empty code option', () => {
        const onSelect = jest.fn();
        const emptyCodeOptions = [
            { code: '', name: 'Empty Code' },
        ];

        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} options={emptyCodeOptions} onSelect={onSelect} />
        );

        fireEvent.press(getByText('Empty Code'));

        expect(onSelect).toHaveBeenCalledWith('');
    });

    it('handles multiple rapid selections', () => {
        const onSelect = jest.fn();
        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} onSelect={onSelect} />
        );

        fireEvent.press(getByText('English'));
        fireEvent.press(getByText('Deutsch'));
        fireEvent.press(getByText('Français'));

        expect(onSelect).toHaveBeenCalledTimes(3);
        expect(onSelect).toHaveBeenCalledWith('en');
        expect(onSelect).toHaveBeenCalledWith('de');
        expect(onSelect).toHaveBeenCalledWith('fr');
    });

    it('handles selection of already selected option', () => {
        const onSelect = jest.fn();
        const { getByText } = render(
            <SimpleSelectPage {...defaultProps} onSelect={onSelect} />
        );

        fireEvent.press(getByText('English'));

        expect(onSelect).toHaveBeenCalledWith('en');
    });

    it('renders with different selected options', () => {
        const { rerender, getAllByTestId } = render(
            <SimpleSelectPage {...defaultProps} selected="en" />
        );

        expect(getAllByTestId('render-icon')).toHaveLength(1);

        rerender(<SimpleSelectPage {...defaultProps} selected="de" />);
        expect(getAllByTestId('render-icon')).toHaveLength(1);

        rerender(<SimpleSelectPage {...defaultProps} selected="fr" />);
        expect(getAllByTestId('render-icon')).toHaveLength(1);
    });

    it('handles undefined onSelect function', () => {
        expect(() => render(
            <SimpleSelectPage {...defaultProps} onSelect={undefined as any} />
        )).not.toThrow();
    });

    it('handles null onSelect function', () => {
        expect(() => render(
            <SimpleSelectPage {...defaultProps} onSelect={null as any} />
        )).not.toThrow();
    });

    it('handles undefined title', () => {
        expect(() => render(
            <SimpleSelectPage {...defaultProps} title={undefined as any} />
        )).not.toThrow();
    });

    it('handles null title', () => {
        expect(() => render(
            <SimpleSelectPage {...defaultProps} title={null as any} />
        )).not.toThrow();
    });
});
