import styled from 'styled-components'

export const Button = styled.button`
  @media (max-width: 480px) {
    width: 100%;
    margin: 0.3rem 0;
    height: 4rem;
  }

  &:hover {
    background: #00bdff;
    transform: translateY(-1px);
  }

  &:active {
    transform: translate(0);
  }

  &::-moz-focus-inner {
    border: 0;
  }

  font-size: 2rem;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  color: white;
  user-select: none;
  outline: none;
  border-radius: 1rem;
  border: none;
  background: #53d1fc;
  height: 3rem;
  width: 5rem;
  margin-right: 2rem;
`
