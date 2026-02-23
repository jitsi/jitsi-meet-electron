import styled from "styled-components";

export default styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 0.5em;
  padding: 1em 0.5em;
  max-width: 100%;
  animation: slideUp 0.4s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1400px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75em;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0;
    gap: 0.5em;
  }
`;
