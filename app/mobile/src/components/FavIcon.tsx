import { FC } from 'react';
import Svg, { SvgProps, G, Path } from 'react-native-svg';

export interface FavIconProps extends SvgProps {
    width?: number | string;
    height?: number | string;
}

const FavIcon: FC<FavIconProps> = ({
    width = 200,
    height = 33,
    ...props
}) => (
    <Svg
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 524.844 87.101"
        {...props}
    >
        <G>
            <G>
                <Path d="M38.67 0v38.65H0A38.66 38.66 0 0 1 38.67 0z" fill="#4f4768" data-color="1" />
                <Path d="M0 80.25V41.59h38.67A38.66 38.66 0 0 1 0 80.25z" fill="#4f4768" data-color="1" />
                <Path d="M41.6 0v38.65h38.67A38.66 38.66 0 0 0 41.6 0z" fill="#4f4768" data-color="1" />
                <Path d="M80.27 80.25V41.59H41.6a38.66 38.66 0 0 0 38.66 38.66z" fill="#4f4768" data-color="1" />
            </G>
        </G>
    </Svg>
);

export default FavIcon;
