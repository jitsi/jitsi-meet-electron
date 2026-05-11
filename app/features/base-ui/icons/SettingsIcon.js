import React from 'react';

import SvgIcon from './SvgIcon';

const settingsPath = [
    'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06',
    'a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09',
    'a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83',
    'l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09',
    'a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.21 6.2a2 2 0 1 1 2.83-2.83',
    'l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09',
    'a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83',
    'l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09',
    'a1.65 1.65 0 0 0-1.51 1z'
].join(' ');

/**
 * Renders the settings icon.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
export default function SettingsIcon(props) {
    return (
        <SvgIcon { ...props }>
            <circle
                cx = '12'
                cy = '12'
                r = '3' />
            <path d = { settingsPath } />
        </SvgIcon>
    );
}
