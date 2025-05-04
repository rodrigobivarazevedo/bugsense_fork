import React from 'react';
import * as S from './Home.styles';
import { RenderLottie } from '../components/RenderLottie';

export const Results: React.FC = () => {

    return (
        <S.Root>
            <S.Title>
                Results Page
            </S.Title>
            <S.Lottie>
                <RenderLottie
                    name="bouncingTestTubes"
                    loop={true}
                />
            </S.Lottie>
        </S.Root>
    );
};

export default Results;
