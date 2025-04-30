import styled from 'styled-components/native';
import { rem } from '../utils/responsive';
import { themeColors } from '../theme/GlobalTheme';

interface TextOnlyProps {
    textOnly?: boolean;
}

export const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  background-color: ${themeColors.white};
  border-radius: ${rem(1.5)}px;
  padding: ${rem(1.5)}px ${rem(1)}px ${rem(1)}px ${rem(1)}px;
  width: 90%;
  max-width: ${rem(25)}px;
  align-self: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
`;

export const ModalButtonRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${rem(0.5)}px;
`;

export const ModalButton = styled.TouchableOpacity<TextOnlyProps>`
  padding: ${rem(0.625)}px ${rem(1)}px;
  margin-left: ${rem(0.5)}px;
  border-radius: ${rem(0.375)}px;
  background-color: ${(props: TextOnlyProps) => (props.textOnly ? 'transparent' : themeColors.secondary)};
`;

export const ModalButtonText = styled.Text<TextOnlyProps>`
  color: ${(props: TextOnlyProps) => (props.textOnly ? themeColors.primary : themeColors.primary)};
  font-weight: 600;
`;
