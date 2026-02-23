import styled from "styled-components";

import { default as TruncatedText } from "./TruncatedText";

export default styled(TruncatedText)`
  font-size: 1.25em;
  font-weight: 800;
  margin-bottom: 0.8em;
  letter-spacing: 0.3px;
  line-height: 1.3;
  word-break: break-word;
  display: block !important;
  white-space: normal !important;
`;
