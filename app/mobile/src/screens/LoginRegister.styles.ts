import styled from 'styled-components/native';
import { themeColors } from '../theme/GlobalTheme';
import { rem } from '../utils/Responsive';

type ButtonProps = {
    disabled?: boolean;
};

type StepIndicatorProps = {
    active?: boolean;
    completed?: boolean;
};

export const Container = styled.View`
    flex: 1;
    background-color: ${themeColors.secondary};
    padding: ${rem(1.25)}px;
    justify-content: center;
`;

export const LogoContainer = styled.View`
    align-items: center;
    margin-bottom: ${rem(3.75)}px;
`;

export const StepIndicatorContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: ${rem(2.5)}px;
    gap: ${rem(0.5)}px;
`;

export const StepIndicator = styled.View<StepIndicatorProps>`
    width: ${rem(0.5)}px;
    height: ${rem(0.5)}px;
    border-radius: ${rem(1)}px;
    background-color: ${(props: StepIndicatorProps) =>
        props.completed ? themeColors.primary :
            props.active ? themeColors.primary : themeColors.white};
    opacity: ${(props: StepIndicatorProps) =>
        props.completed ? 1 :
            props.active ? 1 : 0.5};
`;

export const StepText = styled.Text`
    color: ${themeColors.primary};
    font-size: ${rem(0.875)}px;
    font-weight: 600;
    text-align: center;
    margin-bottom: ${rem(1.25)}px;
`;

export const StepTitle = styled.Text`
    color: ${themeColors.primary};
    font-size: ${rem(1.25)}px;
    font-weight: bold;
    text-align: center;
    margin-bottom: ${rem(1.875)}px;
`;

export const InputContainer = styled.View`
    width: 100%;
    margin-bottom: ${rem(1.25)}px;
`;

export const InputWrapper = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    border-bottom-width: ${rem(0.0625)}px;
    border-bottom-color: ${themeColors.primary};
`;

export const StyledInput = styled.TextInput`
    flex: 1;
    padding: ${rem(1)}px;
    color: ${themeColors.primary};
    font-size: ${rem(1)}px;
    font-family: 'System';
`;

export const IconContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${rem(0.625)}px;
    margin-left: ${rem(0.625)}px;
    margin-right: ${rem(0.625)}px;
`;

export const ActionButton = styled.TouchableOpacity<ButtonProps>`
    width: 100%;
    padding: ${rem(1)}px;
    background-color: ${themeColors.primary};
    border-radius: ${rem(0.5)}px;
    margin-top: ${rem(1.25)}px;
    opacity: ${(props: ButtonProps) => (props.disabled ? 0.5 : 1)};
    align-items: center;
    justify-content: center;
`;

export const ActionButtonText = styled.Text`
    color: white;
    text-align: center;
    font-size: ${rem(1)}px;
    font-family: 'System';
    font-weight: 600;
`;

export const ButtonRow = styled.View`
    flex-direction: row;
    margin-top: ${rem(1.25)}px;
`;

export const SecondaryButton = styled.TouchableOpacity`
    flex: 1;
    padding: ${rem(1)}px;
    background-color: transparent;
    border: ${rem(0.0625)}px solid ${themeColors.primary};
    border-radius: ${rem(0.5)}px;
    align-items: center;
    justify-content: center;
`;

export const SecondaryButtonText = styled.Text`
    color: ${themeColors.primary};
    text-align: center;
    font-size: ${rem(1)}px;
    font-family: 'System';
    font-weight: 600;
`;

export const ForgotPasswordButton = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-top: ${rem(1)}px;
`;

export const ForgotPasswordText = styled.Text`
    color: ${themeColors.primary};
    font-size: ${rem(0.875)}px;
    font-family: 'System';
`;

export const LinkContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-top: ${rem(1.25)}px;
`;

export const LinkText = styled.Text`
    color: ${themeColors.primary};
    font-size: ${rem(1)}px;
`;

export const Link = styled.Text`
    color: ${themeColors.primary};
    font-size: ${rem(1)}px;
    font-weight: bold;
    margin-left: ${rem(0.3125)}px;
`;

export const ErrorText = styled.Text`
    margin-top: ${rem(0.3125)}px;
    color: red;
    font-size: ${rem(0.75)}px;
    font-family: 'System';
`;

export const DropdownContainer = styled.View`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    border: ${rem(0.0625)}px solid ${themeColors.primary};
    border-radius: ${rem(0.25)}px;
    max-height: ${rem(12.5)}px;
    z-index: 1000;
    elevation: 5;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
`;

export const DropdownItem = styled.View`
    padding: ${rem(0.75)}px ${rem(1)}px;
    border-bottom-width: ${rem(0.0625)}px;
    border-bottom-color: #e0e0e0;
`;

export const DropdownText = styled.Text`
    color: ${themeColors.primary};
    font-size: ${rem(0.875)}px;
    font-family: 'System';
`;

export const SecurityQuestionContainer = styled.View`
    margin-bottom: ${rem(1.875)}px;
    padding: ${rem(1)}px;
    border: ${rem(0.0625)}px solid ${themeColors.primary};
    border-radius: ${rem(0.5)}px;
    background-color: rgba(255, 255, 255, 0.05);
`;

export const SecurityQuestionHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${rem(0.75)}px;
`;

export const SecurityQuestionNumber = styled.Text`
    color: ${themeColors.primary};
    font-size: ${rem(0.875)}px;
    font-weight: bold;
`;

export const RemoveButton = styled.TouchableOpacity`
    padding: ${rem(0.25)}px ${rem(0.5)}px;
    background-color: #ff4444;
    border-radius: ${rem(0.25)}px;
`;

export const RemoveButtonText = styled.Text`
    color: white;
    font-size: ${rem(0.75)}px;
    font-weight: bold;
`;

export const AddQuestionButton = styled.TouchableOpacity`
    width: 100%;
    padding: ${rem(0.75)}px;
    background-color: transparent;
    border: ${rem(0.125)}px dashed ${themeColors.primary};
    border-radius: ${rem(0.5)}px;
    margin-top: ${rem(1)}px;
    opacity: 0.7;
    align-items: center;
    justify-content: center;
`;

export const AddQuestionText = styled.Text`
    color: ${themeColors.primary};
    text-align: center;
    font-size: ${rem(0.875)}px;
    font-family: 'System';
`;

export const DropdownButton = styled.TouchableOpacity`
    width: 100%;
    padding: ${rem(1)}px;
    border-bottom-width: ${rem(0.0625)}px;
    border-bottom-color: ${themeColors.primary};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const DropdownButtonText = styled.Text`
    color: ${themeColors.primary};
    font-size: ${rem(1)}px;
    font-family: 'System';
    flex: 1;
`;

export const DropdownArrow = styled.Text`
    color: ${themeColors.primary};
    font-size: ${rem(1.25)}px;
    margin-left: ${rem(0.5)}px;
`;