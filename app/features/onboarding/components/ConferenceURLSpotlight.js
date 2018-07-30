// @flow

import { Spotlight } from '@atlaskit/onboarding';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { continueOnboarding } from '../actions';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;
};

/**
 * Conference URL Spotlight Component.
 */
class ConferenceURLSpotlight extends Component<Props, *> {
    /**
     * Initializes a new {@code ComponentURLSpotlight} instance.
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
                dialogPlacement = 'bottom center'
                target = { 'conference-url' } >
                Enter the name (or full URL) of the room you want to join. You
                may make a name up, just let others know so they enter the same
                name.
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
        this.props.dispatch(continueOnboarding());
    }
}

export default connect()(ConferenceURLSpotlight);

