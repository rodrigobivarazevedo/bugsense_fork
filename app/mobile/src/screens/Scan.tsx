import { FC } from 'react';
import GenericCamera from '../components/GenericCamera';

export const Scan: FC = () => {
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
