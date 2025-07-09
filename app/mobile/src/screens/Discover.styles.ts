import styled from 'styled-components/native';
import { rem } from '../utils/Responsive';

export const Root = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
  padding: ${rem(1)}px;
`;

export const Subtitle = styled.Text`
  font-size: ${rem(1)};
  font-weight: bold;
  color: #333;
  margin-bottom: ${rem(1.5)}px;
`;

export const BacteriaGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${rem(0.5)}px;
`;

export const BacteriaCard = styled.TouchableOpacity`
  width: 48%;
  background-color: white;
  border-radius: ${rem(0.75)}px;
  padding: ${rem(1)}px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export const BacteriaImage = styled.Image`
  width: 100%;
  height: ${rem(5)}px;
  border-radius: ${rem(0.5)}px;
  margin-bottom: ${rem(0.5)};
`;

export const BacteriaName = styled.Text`
  font-size: ${rem(1.125)}px;
  font-weight: 600;
  color: #333;
  margin-bottom: ${rem(0.25)}px;
`;

export const BacteriaDescription = styled.Text`
  font-size: ${rem(0.875)}px;
  color: #666;
  line-height: ${rem(1.25)}px;
`;
