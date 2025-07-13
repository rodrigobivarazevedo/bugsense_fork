import { render } from '@testing-library/react-native';
import BacteriaPage from './BacteriaPage';

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../components/RenderIcon', () => {
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

jest.mock('styled-components/native', () => {
    const React = require('react');
    const styled = {
        ScrollView: (styles: any) => {
            return React.forwardRef(({ children, ...props }: any, ref: any) => {
                return React.createElement('ScrollView', { ...props, ref, testID: props.testID }, children);
            });
        },
        View: (styles: any) => {
            return React.forwardRef(({ children, ...props }: any, ref: any) => {
                return React.createElement('View', { ...props, ref, testID: props.testID }, children);
            });
        },
        Text: (styles: any) => {
            return React.forwardRef(({ children, ...props }: any, ref: any) => {
                return React.createElement('Text', { ...props, ref, testID: props.testID }, children);
            });
        },
        Image: (styles: any) => {
            return React.forwardRef(({ children, ...props }: any, ref: any) => {
                return React.createElement('Image', { ...props, ref, testID: props.testID }, children);
            });
        },
    };
    return styled;
});

describe('BacteriaPage component', () => {
    const mockBacteria = {
        id: 'e-coli',
        name: 'Escherichia coli',
        scientificName: 'Escherichia coli',
        image: { uri: 'https://example.com/e-coli.jpg' },
        description: 'Escherichia coli is a Gram-negative, facultative anaerobic, rod-shaped bacterium.',
        type: 'Gram-negative',
        shape: 'Rod-shaped',
        transmission: [
            'Contaminated food and water',
            'Person-to-person contact',
            'Contact with infected animals'
        ],
        symptoms: [
            'Diarrhea',
            'Abdominal cramps',
            'Nausea and vomiting',
            'Fever'
        ],
        prevention: [
            {
                family: 'materialIcons',
                icon: 'wash',
                text: 'Wash hands frequently'
            },
            {
                family: 'materialIcons',
                icon: 'food-safe',
                text: 'Cook food thoroughly'
            },
            {
                family: 'materialIcons',
                icon: 'water',
                text: 'Drink clean water'
            }
        ],
        treatment: 'Treatment typically involves supportive care and antibiotics in severe cases.'
    };

    const defaultProps = {
        bacteria: mockBacteria,
    };

    it('renders without crashing with default props', () => {
        expect(() => render(<BacteriaPage {...defaultProps} />)).not.toThrow();
    });

    it('renders the bacteria name and scientific name', () => {
        const { getAllByText } = render(<BacteriaPage {...defaultProps} />);
        const nameElements = getAllByText('Escherichia coli');

        expect(nameElements.length).toBeGreaterThan(0);
    });

    it('renders the bacteria image', () => {
        expect(() => render(<BacteriaPage {...defaultProps} />)).not.toThrow();
    });

    it('renders the description', () => {
        const { getByText } = render(<BacteriaPage {...defaultProps} />);
        const descriptionElement = getByText('Escherichia coli is a Gram-negative, facultative anaerobic, rod-shaped bacterium.');

        expect(descriptionElement).toBeTruthy();
    });

    it('renders the type information', () => {
        const { getByText } = render(<BacteriaPage {...defaultProps} />);
        const typeElement = getByText('Gram-negative');

        expect(typeElement).toBeTruthy();
    });

    it('renders the shape information', () => {
        const { getByText } = render(<BacteriaPage {...defaultProps} />);
        const shapeElement = getByText('Rod-shaped');

        expect(shapeElement).toBeTruthy();
    });

    it('renders all transmission methods', () => {
        const { getByText } = render(<BacteriaPage {...defaultProps} />);

        expect(getByText('Contaminated food and water')).toBeTruthy();
        expect(getByText('Person-to-person contact')).toBeTruthy();
        expect(getByText('Contact with infected animals')).toBeTruthy();
    });

    it('renders all symptoms', () => {
        const { getByText } = render(<BacteriaPage {...defaultProps} />);

        expect(getByText('Diarrhea')).toBeTruthy();
        expect(getByText('Abdominal cramps')).toBeTruthy();
        expect(getByText('Nausea and vomiting')).toBeTruthy();
        expect(getByText('Fever')).toBeTruthy();
    });

    it('renders all prevention methods', () => {
        const { getByText } = render(<BacteriaPage {...defaultProps} />);

        expect(getByText('Wash hands frequently')).toBeTruthy();
        expect(getByText('Cook food thoroughly')).toBeTruthy();
        expect(getByText('Drink clean water')).toBeTruthy();
    });

    it('renders prevention icons', () => {
        const { getAllByTestId } = render(<BacteriaPage {...defaultProps} />);
        const icons = getAllByTestId('render-icon');

        expect(icons.length).toBeGreaterThan(0);
    });

    it('renders the treatment information', () => {
        const { getByText } = render(<BacteriaPage {...defaultProps} />);
        const treatmentElement = getByText('Treatment typically involves supportive care and antibiotics in severe cases.');

        expect(treatmentElement).toBeTruthy();
    });

    it('renders section titles', () => {
        const { getByText } = render(<BacteriaPage {...defaultProps} />);

        expect(getByText('overview')).toBeTruthy();
        expect(getByText('transmission')).toBeTruthy();
        expect(getByText('symptoms')).toBeTruthy();
        expect(getByText('prevention')).toBeTruthy();
        expect(getByText('treatment')).toBeTruthy();
    });

    it('handles empty transmission array', () => {
        const bacteriaWithEmptyTransmission = {
            ...mockBacteria,
            transmission: []
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithEmptyTransmission} />
        );

        expect(getByText('transmission')).toBeTruthy();
    });

    it('handles empty symptoms array', () => {
        const bacteriaWithEmptySymptoms = {
            ...mockBacteria,
            symptoms: []
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithEmptySymptoms} />
        );

        expect(getByText('symptoms')).toBeTruthy();
    });

    it('handles empty prevention array', () => {
        const bacteriaWithEmptyPrevention = {
            ...mockBacteria,
            prevention: []
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithEmptyPrevention} />
        );

        expect(getByText('prevention')).toBeTruthy();
    });

    it('handles single transmission method', () => {
        const bacteriaWithSingleTransmission = {
            ...mockBacteria,
            transmission: ['Only one method']
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithSingleTransmission} />
        );

        expect(getByText('Only one method')).toBeTruthy();
    });

    it('handles single symptom', () => {
        const bacteriaWithSingleSymptom = {
            ...mockBacteria,
            symptoms: ['Only one symptom']
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithSingleSymptom} />
        );

        expect(getByText('Only one symptom')).toBeTruthy();
    });

    it('handles single prevention method', () => {
        const bacteriaWithSinglePrevention = {
            ...mockBacteria,
            prevention: [{
                family: 'materialIcons',
                icon: 'single-icon',
                text: 'Only one prevention method'
            }]
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithSinglePrevention} />
        );

        expect(getByText('Only one prevention method')).toBeTruthy();
    });

    it('handles long description', () => {
        const longDescription = 'This is a very long description that contains a lot of information about the bacteria. It might wrap to multiple lines and contain detailed scientific information about the organism, its characteristics, and its behavior in different environments.';

        const bacteriaWithLongDescription = {
            ...mockBacteria,
            description: longDescription
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithLongDescription} />
        );

        expect(getByText(longDescription)).toBeTruthy();
    });

    it('handles long treatment text', () => {
        const longTreatment = 'This is a very long treatment description that contains detailed information about various treatment options, medications, procedures, and recommendations for managing the bacterial infection. It includes information about dosage, duration, side effects, and follow-up care.';

        const bacteriaWithLongTreatment = {
            ...mockBacteria,
            treatment: longTreatment
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithLongTreatment} />
        );

        expect(getByText(longTreatment)).toBeTruthy();
    });

    it('handles special characters in names', () => {
        const bacteriaWithSpecialChars = {
            ...mockBacteria,
            name: 'Bacteria (Special) - Version 2.0',
            scientificName: 'Bacteria_special var. 2.0'
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithSpecialChars} />
        );

        expect(getByText('Bacteria (Special) - Version 2.0')).toBeTruthy();
        expect(getByText('Bacteria_special var. 2.0')).toBeTruthy();
    });

    it('handles numbers in type and shape', () => {
        const bacteriaWithNumbers = {
            ...mockBacteria,
            type: 'Type 1',
            shape: 'Shape 2.0'
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithNumbers} />
        );

        expect(getByText('Type 1')).toBeTruthy();
        expect(getByText('Shape 2.0')).toBeTruthy();
    });

    it('handles transmission methods with special characters', () => {
        const bacteriaWithSpecialTransmission = {
            ...mockBacteria,
            transmission: [
                'Method 1 (Primary)',
                'Method 2 - Secondary',
                'Method 3: Tertiary'
            ]
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithSpecialTransmission} />
        );

        expect(getByText('Method 1 (Primary)')).toBeTruthy();
        expect(getByText('Method 2 - Secondary')).toBeTruthy();
        expect(getByText('Method 3: Tertiary')).toBeTruthy();
    });

    it('handles symptoms with special characters', () => {
        const bacteriaWithSpecialSymptoms = {
            ...mockBacteria,
            symptoms: [
                'Symptom 1 (Mild)',
                'Symptom 2 - Moderate',
                'Symptom 3: Severe'
            ]
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithSpecialSymptoms} />
        );

        expect(getByText('Symptom 1 (Mild)')).toBeTruthy();
        expect(getByText('Symptom 2 - Moderate')).toBeTruthy();
        expect(getByText('Symptom 3: Severe')).toBeTruthy();
    });

    it('handles prevention methods with different icon families', () => {
        const bacteriaWithDifferentIcons = {
            ...mockBacteria,
            prevention: [
                {
                    family: 'antDesign',
                    icon: 'ant-icon',
                    text: 'Ant Design icon method'
                },
                {
                    family: 'fontAwesome',
                    icon: 'fa-icon',
                    text: 'Font Awesome icon method'
                }
            ]
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithDifferentIcons} />
        );

        expect(getByText('Ant Design icon method')).toBeTruthy();
        expect(getByText('Font Awesome icon method')).toBeTruthy();
    });

    it('handles empty strings in text fields', () => {
        const bacteriaWithEmptyStrings = {
            ...mockBacteria,
            description: '',
            treatment: ''
        };

        expect(() => render(
            <BacteriaPage bacteria={bacteriaWithEmptyStrings} />
        )).not.toThrow();
    });

    it('handles very long transmission list', () => {
        const longTransmissionList = Array.from({ length: 20 }, (_, i) => `Transmission method ${i + 1}`);

        const bacteriaWithLongTransmission = {
            ...mockBacteria,
            transmission: longTransmissionList
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithLongTransmission} />
        );

        expect(getByText('Transmission method 1')).toBeTruthy();
        expect(getByText('Transmission method 20')).toBeTruthy();
    });

    it('handles very long symptoms list', () => {
        const longSymptomsList = Array.from({ length: 15 }, (_, i) => `Symptom ${i + 1}`);

        const bacteriaWithLongSymptoms = {
            ...mockBacteria,
            symptoms: longSymptomsList
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithLongSymptoms} />
        );

        expect(getByText('Symptom 1')).toBeTruthy();
        expect(getByText('Symptom 15')).toBeTruthy();
    });

    it('handles very long prevention list', () => {
        const longPreventionList = Array.from({ length: 10 }, (_, i) => ({
            family: 'materialIcons',
            icon: `icon-${i}`,
            text: `Prevention method ${i + 1}`
        }));

        const bacteriaWithLongPrevention = {
            ...mockBacteria,
            prevention: longPreventionList
        };

        const { getByText } = render(
            <BacteriaPage bacteria={bacteriaWithLongPrevention} />
        );

        expect(getByText('Prevention method 1')).toBeTruthy();
        expect(getByText('Prevention method 10')).toBeTruthy();
    });
});
