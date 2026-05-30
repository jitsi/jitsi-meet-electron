
// Default import keeps a live reference to the Mousetrap object so the
// bindGlobal method added by the side-effect plugin import below is visible.
// (A namespace `import * as` snapshots its members before the plugin runs.)
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { openDrawer } from '../../navbar';
import { SettingsIcon } from '../../shared/icons';

import SettingsDrawer from './SettingsDrawer';

interface IProps {
    dispatch: Dispatch;
}

/**
 * Shortcut keys by which the drawer will open.
 */
const drawerShortcut = [ 'command+,', 'ctrl+shift+s' ];

/**
 * Setttings button for Navigation Bar.
 */
class SettingsButton extends Component<IProps> {
    /**
     * Initializes a new {@code SettingsButton} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps) {
        super(props);

        this._onIconClick = this._onIconClick.bind(this);
    }

    /**
     * Bind shortcut when the component did mount.
     *
     * @returns {void}
     */
    componentDidMount() {
        (Mousetrap as any).bindGlobal(drawerShortcut, this._onIconClick);
    }

    /**
     * Bind shortcut when the component before unmount.
     *
     * @returns {void}
     */
    componentWillUnmount() {
        (Mousetrap as any).unbind(drawerShortcut);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <SettingsIcon
                color = 'white'
                onClick = { this._onIconClick }
                size = { 24 } />
        );
    }


    /**
     * Open Settings drawer when SettingsButton is clicked.
     *
     * @returns {void}
     */
    _onIconClick() {
        this.props.dispatch(openDrawer(SettingsDrawer));
    }
}

export default connect()(SettingsButton);
