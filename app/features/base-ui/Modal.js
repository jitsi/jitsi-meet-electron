import PropTypes from 'prop-types';
import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import Button from './Button';

const Overlay = styled.div`
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    inset: 0;
    justify-content: center;
    padding: 24px;
    position: fixed;
    z-index: 1100;
`;

const Container = styled.div`
    background: #1E1E1E;
    border-radius: 24px;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
    max-width: 560px;
    overflow: hidden;
    width: 100%;
`;

const Image = styled.img`
    display: block;
    max-width: 100%;
    width: 100%;
`;

const Content = styled.div`
    padding: 24px;
`;

const Heading = styled.h2`
    margin: 0 0 12px;
`;

const Actions = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
`;

/**
 * Renders a modal dialog.
 *
 * @param {Object} props - Component props.
 * @returns {?ReactElement}
 */
function Modal({ actions, children, heading, image }) {
    if (typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <Overlay>
            <Container>
                { image ? (
                    <Image
                        alt = ''
                        src = { image } />
                ) : null }
                <Content>
                    <Heading>{ heading }</Heading>
                    <div>{ children }</div>
                    <Actions>
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
                    </Actions>
                </Content>
            </Container>
        </Overlay>,
        document.body
    );
}

Modal.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired
    })).isRequired,
    children: PropTypes.node.isRequired,
    heading: PropTypes.string.isRequired,
    image: PropTypes.string
};

Modal.defaultProps = {
    image: undefined
};

export default Modal;
