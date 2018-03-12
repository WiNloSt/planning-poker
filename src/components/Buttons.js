import styled from 'styled-components'

export const Button = styled.button`
  @media (max-width: 480px) {
    width: 100%;
    height: 4rem;
    margin: 0.3em 0;
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

  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 1em;
  color: white;
  user-select: none;
  outline: none;
  border-radius: 0.8em;
  border: none;
  background: #53d1fc;
  height: 3em;
  min-width: 5em;
  margin: 1em 0;
  padding: 0 2em;
  margin-right: 2em;
`
