import { FC } from 'react';
import Lottie from 'lottie-react';

interface RenderLottieProps {
    name: keyof typeof lottieSources;
    overrideSource?: string;
    autoPlay?: boolean;
    loop?: boolean;
    startFrame?: number;
    endFrame?: number;
}

const lottieSources = {
    homeHello: require('../assets/lottie/home-hello.json'),
    bouncingTestTubes: require('../assets/lottie/bouncing-test-tubes.json')
};

const RenderLottie: FC<RenderLottieProps> = ({
    name,
    overrideSource,
    autoPlay = true,
    loop = false,
    startFrame,
    endFrame
}) => {
    return (
        <Lottie
            animationData={overrideSource || lottieSources[name]}
            loop={loop}
            autoplay={autoPlay}
            initialSegment={startFrame && endFrame ? [startFrame, endFrame] : undefined}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default RenderLottie;