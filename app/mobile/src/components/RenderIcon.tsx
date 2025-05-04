import React from 'react';
import { themeColors } from '../theme/GlobalTheme';
import {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    Fontisto,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial,
} from '@expo/vector-icons';
// icons from https://oblador.github.io/react-native-vector-icons/

const IconsMap = {
    antDesign: AntDesign,
    entypo: Entypo,
    evilIcons: EvilIcons,
    feather: Feather,
    fontisto: Fontisto,
    fontAwesome: FontAwesome,
    fontAwesome5: FontAwesome5,
    fontAwesome6: FontAwesome6,
    foundation: Foundation,
    ionIcons: Ionicons,
    materialCommunity: MaterialCommunityIcons,
    materialIcons: MaterialIcons,
    octicons: Octicons,
    simpleLineIcons: SimpleLineIcons,
    zocial: Zocial,
} as const;

type IconFamily = keyof typeof IconsMap;

interface RenderIconProps {
    family: IconFamily;
    icon: string;
    fontSize: number;
    color: keyof typeof themeColors | string;
}

const RenderIcon: React.FC<RenderIconProps> = ({
    family,
    icon,
    fontSize,
    color,
}) => {
    const IconComponent = IconsMap[family];
    if (!IconComponent) return null;

    const resolvedColor =
        themeColors[color as keyof typeof themeColors] || color;

    return (
        <IconComponent
            name={icon as any}
            size={fontSize}
            color={resolvedColor}
        />
    );
};

export default RenderIcon;
