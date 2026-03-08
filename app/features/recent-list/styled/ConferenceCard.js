import styled from "styled-components";

export default styled.div`
  background: linear-gradient(135deg, #1754a9 0%, #0d3a7a 100%);
  border-radius: 1em;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  margin: 0.75em;
  padding: 1.5em;
  box-shadow: 0 4px 12px rgba(23, 84, 169, 0.2);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
  min-height: 140px;
  justify-content: space-between;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0 12px 32px rgba(23, 84, 169, 0.4);
    transform: translateY(-6px);
    border-color: rgba(255, 255, 255, 0.3);
    background: linear-gradient(135deg, #1a5cbb 0%, #103d85 100%);

    &::before {
      left: 100%;
    }

    button {
      opacity: 0.9;
      transform: scale(1.1);
    }
  }

  @media (max-width: 1024px) {
    margin: 0.5em;
    padding: 1.25em;
    min-height: 130px;
  }

  @media (max-width: 768px) {
    margin: 0.5em 0;
    padding: 1em;
    border-radius: 0.8em;
    min-height: auto;
    font-size: 0.85em;
  }
`;
