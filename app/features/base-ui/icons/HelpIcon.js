import React from 'react';

import SvgIcon from './SvgIcon';

/**
 * Renders the help icon.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
export default function HelpIcon(props) {
    return (
        <SvgIcon { ...props }>
            <circle
                cx = '12'
                cy = '12'
                r = '9' />
            <path d = 'M9.75 9a2.25 2.25 0 1 1 3.44 1.91c-.75.48-1.19 1.06-1.19 2.09' />
            <path d = 'M12 17h.01' />
        </SvgIcon>
    );
}
