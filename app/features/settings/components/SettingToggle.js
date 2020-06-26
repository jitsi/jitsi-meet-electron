// @flow

import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import ToggleWithLabel from './ToggleWithLabel';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * The label for the toggle.
     */
    label: String;

    /**
     * The name of the setting.
     */
    settingName: String;

    /**
     * A function to produce setting change events.
     */
    settingChangeEvent: Function;

};

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The props of the redux wrapper component.
 * @returns {Object} A props object including the current value of the setting.
 */
const mapStateToProps = (state, ownProps: Props) => {
    return {
        value: state.settings[ownProps.settingName],
        ...ownProps
    };
};

/**
 * A component to control a single boolean redux setting.
 *
 * @param {Object} props - The props provided by mapStateToProps.
 * @returns {Object} A rendered toggle component with correct state.
 */
function SettingToggle(props: Object) {
    const onChange = useCallback(
        () => props.dispatch(props.settingChangeEvent(!props.value)));

    return (
        <ToggleWithLabel
            isDefaultChecked = { props.value }
            label = { props.label }
            onChange = { onChange }
            value = { props.value } />
    );
}

export default connect(mapStateToProps)(SettingToggle);
