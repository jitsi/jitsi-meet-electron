
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import styled from 'styled-components';

import packageInfo from '../../../../package.json';
import config from '../../config';
import { QuestionCircleIcon } from '../../shared/icons';
import { openExternalLink } from '../../utils';


const Wrapper = styled.div`
    position: relative;
`;

const getDropMenuDisplay = (props: { isOpen?: boolean; }) => {
    if (props.isOpen) {
        return 'block';
    }

    return 'none';
};

const DropMenu = styled.ul<{ isOpen?: boolean; }>`
    background: #2c333d;
    border-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    bottom: 0;
    display: ${getDropMenuDisplay};
    left: 100%;
    list-style: none;
    margin: 0;
    min-width: 180px;
    padding: 4px 0;
    position: absolute;
    z-index: 500;
`;

const GroupHeading = styled.li`
    color: #8993a4;
    font-size: 11px;
    font-weight: 600;
    padding: 8px 12px 4px;
    text-transform: uppercase;
`;

const MenuItem = styled.li`
    color: #f4f5f7;
    cursor: pointer;
    font-size: 14px;
    padding: 8px 12px;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

interface IProps extends WithTranslation {
}

interface IHelpButtonState {
    droplistOpen: boolean;
}


/**
 * Help button for Navigation Bar.
 */
class HelpButton extends Component<IProps, IHelpButtonState> {
    _onAboutClick: () => void;
    _onPrivacyClick: () => void;
    _onSendFeedbackClick: () => void;
    _onSourceClick: () => void;
    _onTermsClick: () => void;
    _wrapperRef?: HTMLElement | null;

    /**
     * Initializes a new {@code HelpButton} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps) {
        super(props);

        this.state = {
            droplistOpen: false
        };

        this._onAboutClick = openExternalLink.bind(undefined, config.aboutURL);
        this._onSourceClick = openExternalLink.bind(undefined, config.sourceURL);
        this._onIconClick = this._onIconClick.bind(this);
        this._onOpenChange = this._onOpenChange.bind(this);
        this._onDocumentClick = this._onDocumentClick.bind(this);
        this._setWrapperRef = this._setWrapperRef.bind(this);
        this._onPrivacyClick
            = openExternalLink.bind(undefined, config.privacyPolicyURL);
        this._onTermsClick
            = openExternalLink.bind(undefined, config.termsAndConditionsURL);
        this._onSendFeedbackClick
            = openExternalLink.bind(undefined, config.feedbackURL);
    }

    /**
     * Attach document click listener for outside-click detection.
     *
     * @returns {void}
     */
    componentDidMount() {
        document.addEventListener('mousedown', this._onDocumentClick);
    }

    /**
     * Remove document click listener on unmount.
     *
     * @returns {void}
     */
    componentWillUnmount() {
        document.removeEventListener('mousedown', this._onDocumentClick);
    }

    /**
     * Stores a ref to the wrapper element for outside-click detection.
     *
     * @param {Element} ref - The element reference.
     * @returns {void}
     */
    _setWrapperRef(ref: HTMLElement | null) {
        this._wrapperRef = ref;
    }

    /**
     * Closes the dropdown when clicking outside.
     *
     * @param {MouseEvent} e - The mousedown event.
     * @returns {void}
     */
    _onDocumentClick(e: MouseEvent) {
        if (this._wrapperRef && !this._wrapperRef.contains(e.target as Node)) {
            this._onOpenChange();
        }
    }

    /**
     * Toggles the droplist.
     *
     * @returns {void}
     */
    _onIconClick() {
        this.setState({
            droplistOpen: !this.state.droplistOpen
        });
    }


    /**
     * Closes droplist when clicked outside.
     *
     * @returns {void}
     */
    _onOpenChange() {
        this.setState({
            droplistOpen: false
        });
    }


    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        return (
            <Wrapper ref = { this._setWrapperRef as any }>
                <QuestionCircleIcon
                    color = 'white'
                    onClick = { this._onIconClick }
                    size = { 24 } />
                <DropMenu isOpen = { this.state.droplistOpen }>
                    <GroupHeading>{ t('help') }</GroupHeading>
                    <MenuItem onClick = { this._onTermsClick }>
                        { t('termsLink') }
                    </MenuItem>
                    <MenuItem onClick = { this._onPrivacyClick }>
                        { t('privacyLink') }
                    </MenuItem>
                    <MenuItem onClick = { this._onSendFeedbackClick }>
                        { t('sendFeedbackLink') }
                    </MenuItem>
                    <MenuItem onClick = { this._onAboutClick }>
                        { t('aboutLink') }
                    </MenuItem>
                    <MenuItem onClick = { this._onSourceClick }>
                        { t('sourceLink') }
                    </MenuItem>
                    <MenuItem>
                        { t('versionLabel', { version: packageInfo.version }) }
                    </MenuItem>
                </DropMenu>
            </Wrapper>
        );
    }
}

export default withTranslation()(HelpButton);
