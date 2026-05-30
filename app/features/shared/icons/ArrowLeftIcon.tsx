
import React from 'react';

interface IProps {
    color?: string;
    onClick?: React.MouseEventHandler<SVGSVGElement>;
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
 * Arrow left icon (replaces @atlaskit/icon/glyph/arrow-left).
 *
 * @param {IProps} props - Component props.
 * @returns {ReactElement}
 */
const ArrowLeftIcon = ({ color = 'currentColor', onClick, size = 24 }: IProps) => (
    <svg
        fill = { color }
        height = { size }
        onClick = { onClick }
        style = { iconStyle }
        viewBox = '0 0 24 24'
        width = { size }
        xmlns = 'http://www.w3.org/2000/svg'>
        <path d = 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' />
    </svg>
);

export default ArrowLeftIcon;
