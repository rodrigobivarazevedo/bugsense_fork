import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as S from './BottomBar.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomBar: React.FC = () => {
    const insets = useSafeAreaInsets();

    return (
        <S.Container insets={insets}>
            <TouchableOpacity onPress={() => { /* Navigate to Home */ }}>
                <S.Icon name="home" size={24} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { /* Navigate to Discover */ }}>
                <S.Icon name="search" size={24} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { /* Navigate to Camera */ }}>
                <S.Icon name="camera-alt" size={24} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { /* Navigate to Results */ }}>
                <S.Icon name="assessment" size={24} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { /* Navigate to Menu */ }}>
                <S.Icon name="menu" size={24} />
            </TouchableOpacity>
        </S.Container>
    );
};

export default BottomBar;
