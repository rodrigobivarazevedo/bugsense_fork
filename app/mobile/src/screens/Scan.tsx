import React from 'react';
import GenericCamera from '../components/GenericCamera';

export const Scan: React.FC = () => {
    return (
        <GenericCamera
            allowFlashToggle
            allowFlipCamera
            showImagePreview
            onPictureTaken={() => {
                console.log('picture taken!');
            }}
        />
    );
};

export default Scan;
