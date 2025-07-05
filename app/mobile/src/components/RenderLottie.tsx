import { useEffect, useRef } from "react";
import LottieView from "lottie-react-native";

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
}

export const RenderLottie = ({
    name,
    overrideSource,
    autoPlay = true,
    loop = false,
    startFrame,
    endFrame
}: RenderLottieProps) => {
    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
        animationRef.current?.play();
        setTimeout(() => {
            animationRef.current?.play(startFrame, endFrame);
        }, 50);
    }, []);

    return (
        <LottieView
            ref={animationRef}
            source={overrideSource || lottieSources[name]}
            style={{ width: "100%", height: "100%" }}
            autoPlay={autoPlay}
            loop={loop}
        />
    );
}

export default RenderLottie;
