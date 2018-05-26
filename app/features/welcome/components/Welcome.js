// @flow

import { AtlasKitThemeProvider } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import { FieldTextStateless } from '@atlaskit/field-text';

import React, { Component } from 'react';
import URL from 'url';

import { WelcomeWrapper as Wrapper, Content, Form } from '../styled';


type Props = {

    /**
     * React Router history object.
     * This contains implementations for managing session history.
     */
    history: Object;
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
export default class Welcome extends Component<Props, State> {
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
    }

    /**
     * Render function of component.
     *
     * @return {ReactElement}
     */
    render() {
        return (
            <AtlasKitThemeProvider mode = 'light'>
                <Wrapper>
                    <Content>
                        <Form onSubmit = { this._onFormSubmit }>
                            <FieldTextStateless
                                autoFocus = { true }
                                isLabelHidden = { true }
                                shouldFitContainer = { true }
                                onChange = { this._onURLChange }
                                type = 'text'
                                value = { this.state.url } />
                        </Form>
                        <Button
                            appearance = 'primary'
                            type = 'button'
                            onClick = { this._onJoin }>
                            GO
                        </Button>
                    </Content>
                </Wrapper>
            </AtlasKitThemeProvider>
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
            this.props.history.push(url.host + url.path);
        } else {

            // Directly to the the path.
            this.props.history.push(url.path);
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
