import styled from 'styled-components/native';
import { themeColors } from '../theme/GlobalTheme';
import { rem } from '../utils/Responsive';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${themeColors.white};
  padding: ${rem(1)}px;
`;

export const SectionDivider = styled.View`
  height: ${rem(0.0625)}px;
  background-color: ${themeColors.secondary};
  margin-vertical: ${rem(1)}px;
`;

export const SectionHeader = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${themeColors.themeGray};
  margin-bottom: ${rem(0.5)}px;
  margin-top: ${rem(0.5)}px;
`;

export const OptionButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${rem(0.5)}px;
  margin-bottom: 0;
`;

export const OptionIconTextWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${rem(0.5)}px;
`;

export const OptionText = styled.Text`
  font-size: 16px;
  color: ${themeColors.primary};
`;

export const OptionArrow = styled.View`
  margin-left: ${rem(0.5)}px;
`;
