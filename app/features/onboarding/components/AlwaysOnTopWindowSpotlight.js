// @flow

import { Spotlight } from '@atlaskit/onboarding';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { closeDrawer } from '../../navbar';

import { continueOnboarding } from '../actions';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;
};

/**
 * Always on Top Windows Spotlight Component.
 */
class AlwaysOnTopWindowSpotlight extends Component<Props, *> {
    /**
     * Initializes a new {@code StartMutedTogglesSpotlight} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._next = this._next.bind(this);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <Spotlight
                actions = { [
                    {
                        onClick: this._next,
                        text: 'Next'
                    }
                ] }
                dialogPlacement = 'left top'
                target = { 'always-on-top-window' } >
                You can toggle whether you want to enable the "always-on-top" window,
                which is displayed when the main window loses focus.
                This will be applied to all conferences.
            </Spotlight>
        );
    }

    _next: (*) => void;

    /**
     * Close the spotlight component.
     *
     * @returns {void}
     */
    _next() {
        const { dispatch } = this.props;

        dispatch(continueOnboarding());

        // FIXME: find a better way to do this.
        setTimeout(() => {
            dispatch(closeDrawer());
        }, 300);
    }
}

export default connect()(AlwaysOnTopWindowSpotlight);
