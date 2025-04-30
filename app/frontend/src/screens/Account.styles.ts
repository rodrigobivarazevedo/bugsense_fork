import styled from 'styled-components/native';
import { themeColors, themeTypography } from '../theme/GlobalTheme';
import { rem } from '../utils/responsive';

export const Scroll = styled.ScrollView`
  flex: 1;
  background-color: ${themeColors.white};
  padding: ${rem(1.25)}px;
`;

export const ProfileCard = styled.View`
  background-color: ${themeColors.primary};
  border-radius: ${rem(1)}px;
  margin-bottom: ${rem(2)}px;
  overflow: hidden;
  min-height: ${rem(7)}px;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.08);
  elevation: 2;
`;

export const ProfileCardBgLogo = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: flex-start;
  z-index: 0;
`;

export const ProfileCardContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${rem(1.5)}px ${rem(1.25)}px;
  z-index: 1;
`;

export const ProfileImage = styled.View`
  width: ${rem(4)}px;
  height: ${rem(4)}px;
  border-radius: ${rem(2)}px;
  background-color: ${themeColors.secondary};
  align-items: center;
  justify-content: center;
  margin-right: ${rem(1.25)}px;
`;

export const ProfileInfo = styled.View`
  flex: 1;
`;

export const UserName = styled.Text`
  ${themeTypography.h1};
  color: ${themeColors.white};
  margin-bottom: ${rem(0.25)}px;
`;

export const DateJoined = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.secondary};
  margin-bottom: ${rem(0.75)}px;
`;

export const QRButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${themeColors.secondary};
  border-radius: ${rem(0.5)}px;
  padding: ${rem(0.5)}px ${rem(1)}px;
  align-self: flex-start;
`;

export const QRButtonText = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.primary};
  font-weight: 600;
  margin-left: ${rem(0.5)}px;
`;

export const EditIconBtn = styled.TouchableOpacity`
  padding: ${rem(0.5)}px;
  position: absolute;
  top: ${rem(0.5)}px;
  right: ${rem(0.5)}px;
  z-index: 2;
`;

export const SectionTitle = styled.Text`
  ${themeTypography.h1};
  color: ${themeColors.primary};
  margin-bottom: ${rem(0.5)}px;
  margin-top: ${rem(1.5)}px;
`;

export const Card = styled.View`
  background-color: ${themeColors.primary};
  border-radius: ${rem(1)}px;
  margin-bottom: ${rem(1.5)}px;
  padding: ${rem(1)}px ${rem(1)}px;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.08);
  elevation: 1;
`;

export const ItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${rem(0.75)}px;
  position: relative;
`;

export const ItemLabel = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.themeGray};
  font-size: 14px;
`;

export const ItemValue = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.primary};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: ${rem(0.5)}px;
`;

export const DeleteButton = styled.TouchableOpacity`
  background-color: #e53935;
  border-radius: ${rem(0.5)}px;
  padding: ${rem(1)}px;
  margin-vertical: ${rem(1.5)}px;
  align-items: center;
`;

export const DeleteButtonText = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.white};
  font-weight: 700;
`;

export const ActionButton = styled.TouchableOpacity`
  background-color: ${themeColors.secondary};
  border-radius: ${rem(0.5)}px;
  padding: ${rem(1)}px;
  margin-bottom: ${rem(1)}px;
  align-items: center;
`;

export const ActionButtonText = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.primary};
  font-weight: 600;
`;

export const ViewProfileButton = styled.TouchableOpacity`
  padding-vertical: ${rem(0.5)}px;
  padding-horizontal: ${rem(1)}px;
  border-radius: ${rem(0.5)}px;
  background-color: ${themeColors.secondary};
  align-self: flex-start;
`;

export const ViewProfileText = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.primary};
  font-weight: 500;
`;

export const Divider = styled.View`
  height: ${rem(0.0625)}px;
  background-color: ${themeColors.secondary};
  margin-vertical: ${rem(1.5)}px;
`;

export const OptionsSection = styled.View`
  margin-top: ${rem(1)}px;
`;

export const OptionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${rem(1)}px;
  margin-bottom: ${rem(1)}px;
`;

export const OptionIcon = styled.View`
  margin-right: ${rem(1)}px;
`;

export const OptionText = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.primary};
  flex: 1;
`;

export const ShareIcon = styled.View`
  margin-left: ${rem(0.5)}px;
`;

export const LightCard = styled.View`
  background-color: ${themeColors.white};
  border-radius: ${rem(1)}px;
  margin-bottom: ${rem(1.5)}px;
  padding: ${rem(1)}px ${rem(1)}px;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.075;
  shadow-radius: 8px;
`;

export const ItemTextCol = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const EditIconBtnLight = styled.TouchableOpacity`
  padding: ${rem(0.5)}px;
  margin-left: ${rem(1)}px;
  align-self: flex-start;
`;

export const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  background-color: ${themeColors.white};
  border-radius: ${rem(1)}px;
  padding: ${rem(1.5)}px;
  width: 80%;
  max-width: ${rem(20)}px;
`;

export const ModalTitle = styled.Text`
  ${themeTypography.h1};
  color: ${themeColors.primary};
  margin-bottom: ${rem(1)}px;
  text-align: center;
  font-size: ${rem(1.5)}px;
`;

export const ModalOption = styled.View`
  padding: ${rem(1)}px;
  border-bottom-width: 1px;
  border-bottom-color: ${themeColors.secondary};
`;

export const ModalOptionText = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.primary};
  text-align: center;
`;

export const AddressContainer = styled.View`
  position: relative;
  width: 100%;
`;

export const LoadingContainer = styled.View`
  position: absolute;
  right: 0;
  top: 0;
  padding: ${rem(0.5)}px;
`;

export const SuggestionsContainer = styled.View`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${themeColors.white};
  border-radius: ${rem(0.5)}px;
  margin-top: ${rem(0.25)}px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  z-index: 1;
`;

export const SuggestionItem = styled.View`
  padding: ${rem(0.75)}px ${rem(1)}px;
  border-bottom-width: 1px;
  border-bottom-color: ${themeColors.secondary};
`;

export const SuggestionText = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.primary};
`;

export const SuggestionsModalContent = styled.View`
  background-color: ${themeColors.white};
  border-radius: ${rem(1)}px;
  padding: ${rem(1)}px;
  width: 90%;
  max-width: ${rem(25)}px;
  align-self: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
`; 