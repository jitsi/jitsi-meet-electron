
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from '../../shared/components/Button';
import { continueOnboarding } from '../actions';


const Backdrop = styled.div`
    background: rgba(0, 0, 0, 0.5);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 900;
`;

const Popover = styled.div`
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    color: #333;
    max-width: 280px;
    padding: 16px;
    position: fixed;
    z-index: 901;
`;

const PopoverText = styled.p`
    font-size: 14px;
    margin-bottom: 12px;
`;

const PopoverActions = styled.div`
    display: flex;
    justify-content: flex-end;
`;

/**
 * Calculates the popover position for a target element.
 *
 * @param {Element} targetEl - The target DOM element.
 * @param {string} placement - Placement hint string.
 * @returns {Object} CSS position style.
 */
function getPopoverStyle(targetEl, placement) {
    if (!targetEl) {
        return {};
    }

    const rect = targetEl.getBoundingClientRect();

    if (placement.includes('bottom')) {
        return {
            left: rect.left,
            top: rect.bottom + 8
        };
    }

    if (placement.includes('top')) {
        return {
            bottom: window.innerHeight - rect.top + 8,
            left: rect.left
        };
    }

    return {
        left: rect.right + 8,
        top: rect.top
    };
}

/**
 * OnboardingSpotlight highlights a named target element and shows a
 * tooltip-style popover with a "Next" button.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
const OnboardingSpotlight = props => {
    const { t } = useTranslation();

    const targetEl = props.target
        ? document.querySelector(`[data-spotlight-id="${props.target}"]`)
        : null;

    const popoverStyle = getPopoverStyle(targetEl, props.dialogPlacement || 'bottom center');

    const _onNext = useCallback(() => {
        props.dispatch(continueOnboarding());
        if (props.onNext) {
            props.onNext(props);
        }
    }, [ props ]);

    return (
        <>
            <Backdrop />
            <Popover style = { popoverStyle }>
                <PopoverText>{ t(props.text) }</PopoverText>
                <PopoverActions>
                    <Button
                        appearance = 'primary'
                        onClick = { _onNext }
                        type = 'button'>
                        { t('onboarding.next') }
                    </Button>
                </PopoverActions>
            </Popover>
        </>
    );
};

OnboardingSpotlight.propTypes = {
    dialogPlacement: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    onNext: PropTypes.func,
    target: PropTypes.string,
    text: PropTypes.string
};

export default connect()(OnboardingSpotlight);
