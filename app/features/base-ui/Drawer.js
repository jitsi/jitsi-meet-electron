import PropTypes from 'prop-types';
import React from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`;

const slideIn = keyframes`
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
`;

const Overlay = styled.div`
    animation: ${fadeIn} 0.2s ease;
    background: rgba(9, 30, 66, 0.55);
    inset: 0;
    position: fixed;
    z-index: 1000;
`;

const panelElement = ({ _width, ...props }) => React.createElement('aside', props);

const Panel = styled(panelElement)`
    animation: ${slideIn} 0.2s ease;
    background: #0F2747;
    box-shadow: 0 16px 48px rgba(9, 30, 66, 0.35);
    color: #FFFFFF;
    height: 100%;
    left: 0;
    max-width: 100%;
    position: absolute;
    top: 0;
    width: ${props => props._width};
`;

/**
 * Prevents clicks inside the drawer from closing the overlay.
 *
 * @param {Event} event - The click event.
 * @returns {void}
 */
function _stopOverlayClose(event) {
    event.stopPropagation();
}

/**
 * Renders a sliding overlay drawer.
 *
 * @param {Object} props - Component props.
 * @returns {?ReactElement}
 */
function Drawer({ children, isOpen, onClose, width }) {
    if (!isOpen || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <Overlay onClick = { onClose }>
            <Panel
                _width = { width }
                onClick = { _stopOverlayClose }>
                { children }
            </Panel>
        </Overlay>,
        document.body
    );
}

Drawer.defaultProps = {
    onClose: undefined,
    width: '360px'
};

Drawer.propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    width: PropTypes.string
};

export default Drawer;
