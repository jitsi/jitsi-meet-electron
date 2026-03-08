import styled from "styled-components";

export default styled.div`
  animation: fadeInDown 0.5s ease-out;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
