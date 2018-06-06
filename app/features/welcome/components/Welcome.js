// @flow

import Button from '@atlaskit/button';
import { FieldTextStateless } from '@atlaskit/field-text';

import React, { Component } from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import URL from 'url';

import { setTheme } from '../../app';
import { WelcomeWrapper as Wrapper, Content, Form } from '../styled';


type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;
};

type State = {

    /**
     * URL of the room to join.
     * If this is not a url it will be treated as room name for default domain.
     */
    url: string;
};

/**
 * Welcome Component.
 */
class Welcome extends Component<Props, State> {
    /**
     * Initializes a new {@code Welcome} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            url: ''
        };

        // Bind event handlers.
        this._onURLChange = this._onURLChange.bind(this);
        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._onJoin = this._onJoin.bind(this);

        // Set light theme for Welcome Page.
        this.props.dispatch(setTheme('light'));
    }

    /**
     * Set dark them when leaving Welcome Page.
     */
    componentWillUnmount() {
        this.props.dispatch(setTheme('dark'));
    }

    /**
     * Render function of component.
     *
     * @return {ReactElement}
     */
    render() {
        return (
            <Wrapper>
                <Content>
                    <Form onSubmit = { this._onFormSubmit }>
                        <FieldTextStateless
                            autoFocus = { true }
                            isLabelHidden = { true }
                            onChange = { this._onURLChange }
                            shouldFitContainer = { true }
                            type = 'text'
                            value = { this.state.url } />
                    </Form>
                    <Button
                        appearance = 'primary'
                        onClick = { this._onJoin }
                        type = 'button'>
                        GO
                    </Button>
                </Content>
            </Wrapper>
        );
    }

    _onFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and delegates the join logic.
     */
    _onFormSubmit(event: Event) {
        event.preventDefault();
        this._onJoin();
    }

    _onJoin: (*) => void;

    /**
     * Redirect and join conference.
     */
    _onJoin() {
        const url = URL.parse(this.state.url);

        // Check if the parsed url is a full url or just room name.
        if (url.host && url.path) {

            // This will be triggered when the full url is present.
            this.props.dispatch(push(url.host + url.path));
        } else {

            // Directly to the the path.
            this.props.dispatch(push(url.path));
        }
    }

    _onURLChange: (*) => void;

    /**
     * Keeps URL input value and URL in state in sync.
     */
    _onURLChange(event: SyntheticInputEvent<HTMLInputElement>) {
        this.setState({
            url: event.currentTarget.value
        });
    }
}

export default connect()(Welcome);
