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
 * Start Muted Toggles Spotlight Component.
 */
class StartMutedTogglesSpotlight extends Component<Props, *> {
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
                target = { 'start-muted-toggles' } >
                You can toggle if you want to start with your audio or video
                muted here. This will be applied to all conferences.
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

export default connect()(StartMutedTogglesSpotlight);

