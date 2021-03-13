// @flow

import styled from 'styled-components';

export default styled.div`
    background: #526d32;
    background: linear-gradient(to right, #526d32 0%, #789f47 50%,#526d32 100%);
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding-top: 15%;

    button.enterButton {
        border-radius: 6px;
        padding: 0 1.7em;
        border: none;
        background-color: #b5e282;
        color: #333 !important;
        font-weight: bold;
    }

    button.enterButton:hover {
        background-color: #fff;
    }
`;
