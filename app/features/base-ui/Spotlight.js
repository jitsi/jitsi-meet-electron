import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import Button from './Button';

const Overlay = styled.div`
    background: rgba(0, 0, 0, 0.6);
    inset: 0;
    position: fixed;
    z-index: 1100;
`;

const Highlight = styled.div`
    border: 2px solid rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.15);
    pointer-events: none;
    position: fixed;
`;

const Dialog = styled.div`
    background: #1E1E1E;
    border-radius: 18px;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.35);
    max-width: 320px;
    padding: 20px;
    position: fixed;
`;

const Text = styled.p`
    margin: 0 0 16px;
`;

/**
 * Limits a position to a viewport range.
 *
 * @param {number} value - Requested value.
 * @param {number} min - Lower bound.
 * @param {number} max - Upper bound.
 * @returns {number}
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Calculates the spotlight dialog position.
 *
 * @param {DOMRect} rect - Target bounds.
 * @param {string} dialogPlacement - Requested placement.
 * @returns {{ left: number, top: number }}
 */
function getDialogPosition(rect, dialogPlacement) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dialogWidth = 320;
    const fallbackBottom = rect.bottom + 16;

    if (dialogPlacement === 'bottom center') {
        return {
            left: clamp(rect.left + (rect.width / 2) - (dialogWidth / 2), 16, viewportWidth - dialogWidth - 16),
            top: clamp(fallbackBottom, 16, viewportHeight - 140)
        };
    }

    if (rect.top < 180) {
        return {
            left: clamp(rect.right - dialogWidth, 16, viewportWidth - dialogWidth - 16),
            top: clamp(fallbackBottom, 16, viewportHeight - 140)
        };
    }

    return {
        left: clamp(rect.right - dialogWidth, 16, viewportWidth - dialogWidth - 16),
        top: clamp(rect.top - 140, 16, viewportHeight - 140)
    };
}

/**
 * Renders a spotlight callout anchored to a named target.
 *
 * @param {Object} props - Component props.
 * @returns {?ReactElement}
 */
function Spotlight({ actions, children, dialogPlacement, target }) {
    const [ rect, setRect ] = useState();

    useEffect(() => {
        const updatePosition = () => {
            const targetElement = document.querySelector(`[data-spotlight-target="${target}"]`);

            if (!targetElement) {
                setRect(undefined);

                return;
            }

            const bounds = targetElement.getBoundingClientRect();

            setRect(bounds.width && bounds.height ? bounds : undefined);
        };

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [ target ]);

    const dialogPosition = useMemo(() => rect && getDialogPosition(rect, dialogPlacement), [ dialogPlacement, rect ]);

    if (!rect || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <Overlay>
            <Highlight
                style = {{
                    height: rect.height + 16,
                    left: rect.left - 8,
                    top: rect.top - 8,
                    width: rect.width + 16
                }} />
            <Dialog style = { dialogPosition }>
                <Text>{ children }</Text>
                { actions.map((action, index) => {
                    const _onClick = action.onClick;

                    return (
                        <Button
                            appearance = { index === 0 ? 'primary' : 'subtle' }
                            key = { action.text }
                            onClick = { _onClick }>
                            { action.text }
                        </Button>
                    );
                }) }
            </Dialog>
        </Overlay>,
        document.body
    );
}

Spotlight.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired
    })).isRequired,
    children: PropTypes.node.isRequired,
    dialogPlacement: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired
};

export default Spotlight;
