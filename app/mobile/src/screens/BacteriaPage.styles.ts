import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Root = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
`;

export const Header = styled.View`
  background-color: white;
  padding: 20px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export const BacteriaImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 16px;
  margin-bottom: 16px;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

export const ScientificName = styled.Text`
  font-size: 18px;
  color: #666;
  font-style: italic;
  margin-bottom: 16px;
`;

export const Content = styled.View`
  padding: 20px;
`;

export const Section = styled.View`
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

export const Description = styled.Text`
  font-size: 16px;
  color: #444;
  line-height: 24px;
  margin-bottom: 16px;
`;

export const InfoGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

export const InfoItem = styled.View`
  background-color: #f0f0f0;
  padding: 12px;
  border-radius: 12px;
  flex: 1;
  min-width: 45%;
`;

export const InfoLabel = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

export const InfoValue = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

export const SymptomsList = styled.View`
  margin-top: 8px;
`;

export const SymptomItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const BulletPoint = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #666;
  margin-right: 12px;
`;

export const SymptomText = styled.Text`
  font-size: 16px;
  color: #444;
  flex: 1;
`;

export const PreventionList = styled.View`
  margin-top: 8px;
`;

export const PreventionItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

export const PreventionIcon = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #e8f5e9;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

export const PreventionText = styled.Text`
  font-size: 16px;
  color: #444;
  flex: 1;
`; 