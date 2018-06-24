// @flow

import SettingsIcon from '@atlaskit/icon/glyph/settings';

import * as Mousetrap from 'mousetrap';
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
 * Shortcut keys by which the drawer will open.
 */
const drawerShortcut = [ 'command+,', 'ctrl+shift+s' ];

/**
 * Setttings button for Navigation Bar.
 */
class SettingButton extends Component<Props, *> {
    /**
     * Initializes a new {@code SettingButton} instance.
     *
     * @inheritdoc
     */
    constructor() {
        super();

        this._onIconClick = this._onIconClick.bind(this);
    }

    /**
     * Bind shortcut when the component did mount.
     *
     * @returns {void}
     */
    componentDidMount() {
        Mousetrap.bind(drawerShortcut, this._onIconClick);
    }

    /**
     * Bind shortcut when the component before unmount.
     *
     * @returns {void}
     */
    componentWillUnmount() {
        Mousetrap.unbind(drawerShortcut);
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
     * Open Settings drawer when SettingButton is clicked.
     *
     * @returns {void}
     */
    _onIconClick() {
        this.props.dispatch(openDrawer(SettingsDrawer));
    }
}

export default connect()(SettingButton);
