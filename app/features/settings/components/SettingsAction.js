// @flow

import SettingsIcon from '@atlaskit/icon/glyph/settings';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { openDrawer } from '../../navbar';

import SettingsDrawer from './SettingsDrawer';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;
};

/**
 * Setttings Action for Navigation Bar.
 */
class SettingsAction extends Component<Props, *> {
    /**
     * Initializes a new {@code SettingsAction} instance.
     *
     * @inheritdoc
     */
    constructor() {
        super();

        this._onIconClick = this._onIconClick.bind(this);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <SettingsIcon
                onClick = { this._onIconClick } />
        );
    }

    _onIconClick: (*) => void;

    /**
     * Open Settings drawer when SettingsAction is clicked.
     *
     * @returns {void}
     */
    _onIconClick() {
        this.props.dispatch(openDrawer(SettingsDrawer));
    }
}

export default connect()(SettingsAction);
