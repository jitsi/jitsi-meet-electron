import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: inline-flex;
    position: relative;
`;

const Panel = styled.div`
    background: #102A4C;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    box-shadow: 0 16px 32px rgba(9, 30, 66, 0.35);
    min-width: 220px;
    padding: 8px;
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    z-index: 200;
`;

/**
 * Renders a simple dropdown menu around a trigger element.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
function DropdownMenu({ children, isOpen, onClose, onToggle, trigger }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handlePointerDown = event => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handlePointerDown);

        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [ isOpen, onClose ]);

    return (
        <Container innerRef = { containerRef }>
            { React.cloneElement(trigger, {
                'aria-expanded': isOpen,
                onClick: onToggle
            }) }
            { isOpen ? <Panel role = 'menu'>{ children }</Panel> : null }
        </Container>
    );
}

DropdownMenu.propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    trigger: PropTypes.element.isRequired
};

export default DropdownMenu;
