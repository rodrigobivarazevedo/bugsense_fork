import React from 'react';
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
// find all the icons in the @expo/vector-icons library: https://oblador.github.io/react-native-vector-icons/

interface IconRendererProps {
    family: string;
    icon: string;
    fontSize: number;
    color: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({
    family,
    icon,
    fontSize,
    color
}) => {
    switch (family) {
        case 'antDesign':
            return <AntDesign name={icon as keyof typeof AntDesign.glyphMap} size={fontSize} color={color} />;
        case 'entypo':
            return <Entypo name={icon as keyof typeof Entypo.glyphMap} size={fontSize} color={color} />;
        case 'evilIcons':
            return <EvilIcons name={icon as keyof typeof EvilIcons.glyphMap} size={fontSize} color={color} />;
        case 'feather':
            return <Feather name={icon as keyof typeof Feather.glyphMap} size={fontSize} color={color} />;
        case 'fontisto':
            return <Fontisto name={icon as keyof typeof Fontisto.glyphMap} size={fontSize} color={color} />;
        case 'fontawesome':
            return <FontAwesome name={icon as keyof typeof FontAwesome.glyphMap} size={fontSize} color={color} />;
        case 'fontawesome5':
            return <FontAwesome5 name={icon as keyof typeof FontAwesome5.glyphMap} size={fontSize} color={color} />;
        case 'fontawesome6':
            return <FontAwesome6 name={icon as keyof typeof FontAwesome6.glyphMap} size={fontSize} color={color} />;
        case 'foundation':
            return <Foundation name={icon as keyof typeof Foundation.glyphMap} size={fontSize} color={color} />;
        case 'ionIcons':
            return <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={fontSize} color={color} />;
        case 'materialCommunity':
            return <MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons.glyphMap} size={fontSize} color={color} />;
        case 'materialIcons':
            return <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={fontSize} color={color} />;
        case 'octicons':
            return <Octicons name={icon as keyof typeof Octicons.glyphMap} size={fontSize} color={color} />;
        case 'simpleLineIcons':
            return <SimpleLineIcons name={icon as keyof typeof SimpleLineIcons.glyphMap} size={fontSize} color={color} />;
        case 'zocial':
            return <Zocial name={icon as keyof typeof Zocial.glyphMap} size={fontSize} color={color} />;
        default:
            return null;
    }
};

export default IconRenderer;
