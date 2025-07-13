import { FC } from 'react';
import styled from 'styled-components/native';
import RenderIcon from './RenderIcon';

const NotificationWrapper = styled.View`
  position: relative;
`;

const NotificationDot = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: #FF4444;
  border-width: 2px;
  border-color: white;
  z-index: 10;
`;

interface NotificationIndicatorProps {
    family: string;
    icon: string;
    fontSize: number;
    color: string;
    hasNotifications: boolean;
}

const NotificationIndicator: FC<NotificationIndicatorProps> = ({
    family,
    icon,
    fontSize,
    color,
    hasNotifications,
}) => {
    return (
        <NotificationWrapper>
            <RenderIcon
                family={family as any}
                icon={icon}
                fontSize={fontSize}
                color={color}
            />
            {hasNotifications && <NotificationDot />}
        </NotificationWrapper>
    );
};

export default NotificationIndicator;
