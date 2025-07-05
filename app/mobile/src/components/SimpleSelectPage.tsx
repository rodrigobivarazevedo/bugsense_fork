import { FC } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './SimpleSelectPage.styles';
import RenderIcon from './RenderIcon';
import { rem } from '../utils/Responsive';

export interface SimpleSelectOption {
    code: string;
    name: string;
}

interface SimpleSelectPageProps {
    title: string;
    options: SimpleSelectOption[];
    selected: string;
    onSelect: (code: string) => void;
}

const SimpleSelectPage: FC<SimpleSelectPageProps> = ({ title, options, selected, onSelect }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.code}
                    style={[
                        styles.languageButton,
                        selected === option.code && styles.languageButtonActive,
                    ]}
                    onPress={() => onSelect(option.code)}
                >
                    <Text style={styles.languageText}>{option.name}</Text>
                    {selected === option.code && (
                        <RenderIcon
                            family="materialIcons"
                            icon="check"
                            fontSize={rem(1.75)}
                            color="primary"
                        />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default SimpleSelectPage; 