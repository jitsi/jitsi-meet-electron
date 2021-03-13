// Flow

import styled from 'styled-components';

export default styled.form`
    @import "../app/main.css";
    width: 100%;
    margin: 0 15%;

    div {
        border: none;
        padding: 0px;
        margin: 0px;
        border-radius: 16px;
    }

    div > div > div > div {
        padding: 0px;
        margin: 0px;
        border-radius: 8px;
        border-color: #b5e282;
        margin-right: 8px;
    }

    input {
        background-color: #fff;
        border-radius: 16px;
        border-color: #b5e282;
        padding: 0.8em 1.5em
        border: 1px solid #fff;
        margin: 0px;
        border-radius: 8px;
        color: #222;
    }

    input::placeholder {
        color: #5a5a5a;
    }

    button {
        border-radius: 6px;
        padding: 0 1.7em;
        border: none;
        background-color: #b5e282;
        color: #222 !important;
        font-weight: bold;
    }

    button:hover {
        background-color: #fff;
    }
`;
