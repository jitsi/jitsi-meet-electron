
import React from 'react';

interface IProps {
    onClick?: React.MouseEventHandler<SVGSVGElement>;
    primaryColor?: string;
    size?: number;
}

const iconStyle: React.CSSProperties = {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'inline-flex',
    fill: 'currentColor',
    justifyContent: 'center'
};

/**
 * Cross (close/remove) icon (replaces @atlaskit/icon/glyph/cross).
 *
 * @param {IProps} props - Component props.
 * @returns {ReactElement}
 */
const CrossIcon = ({ onClick, primaryColor = 'currentColor', size = 24 }: IProps) => (
    <svg
        fill = { primaryColor }
        height = { size }
        onClick = { onClick }
        style = { iconStyle }
        viewBox = '0 0 24 24'
        width = { size }
        xmlns = 'http://www.w3.org/2000/svg'>
        <path
            // eslint-disable-next-line max-len
            d = 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
    </svg>
);

export default CrossIcon;
