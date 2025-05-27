import styled from 'styled-components/native';
import { themeColors } from '../theme/GlobalTheme';
import { rem } from '../utils/Responsive';

type ButtonProps = {
    disabled?: boolean;
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

export const IconContainer = styled.TouchableOpacity`
    padding: ${rem(0.625)}px;
`;

export const ActionButton = styled.TouchableOpacity<ButtonProps>`
    width: 100%;
    padding: ${rem(1)}px;
    background-color: ${themeColors.primary};
    border-radius: ${rem(0.5)}px;
    margin-top: ${rem(1.25)}px;
    opacity: ${(props: ButtonProps) => (props.disabled ? 0.5 : 1)};
`;

export const ActionButtonText = styled.Text`
    color: white;
    text-align: center;
    font-size: ${rem(1)}px;
    font-family: 'System';
    font-weight: 600;
`;

export const ForgotPasswordButton = styled.TouchableOpacity`
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