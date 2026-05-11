import React from 'react';

import SvgIcon from './SvgIcon';

/**
 * Renders the back arrow icon.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
export default function ArrowLeftIcon(props) {
    return (
        <SvgIcon { ...props }>
            <path d = 'M19 12H5' />
            <path d = 'm12 19-7-7 7-7' />
        </SvgIcon>
    );
}
