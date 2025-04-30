import styled from 'styled-components/native';
import { rem } from '../utils/responsive';
import { themeColors } from '../theme/GlobalTheme';

type LoginButtonProps = {
  disabled: boolean;
};

export const Container = styled.View`
  flex: 1;
  background-color: ${themeColors.secondary};
  justify-content: center;
  align-items: center;
  padding: ${rem(1.25)}px;
`;

export const LogoContainer = styled.View`
  margin-bottom: ${rem(3.75)}px;
  align-items: center;
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
  padding: ${rem(0.625)}px;
`;

export const LoginButton = styled.TouchableOpacity<LoginButtonProps>`
  width: 100%;
  padding: ${rem(1)}px;
  background-color: ${themeColors.primary};
  border-radius: ${rem(0.5)}px;
  margin-top: ${rem(1.25)}px;
  opacity: ${(props: LoginButtonProps) => (props.disabled ? 0.5 : 1)};
`;

export const LoginButtonText = styled.Text`
  color: white;
  text-align: center;
  font-size: ${rem(1)}px;
  font-family: 'System';
  font-weight: 600;
`;

export const ForgotPasswordButton = styled.TouchableOpacity`
  margin-top: ${rem(1)}px;
`;

export const ForgotPasswordText = styled.Text`
  color: ${themeColors.primary};
  font-size: ${rem(0.875)}px;
  font-family: 'System';
`; 