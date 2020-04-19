import React, { Component } from 'react';
import styled from 'styled-components';

const Base = styled.div`
  color: black;
  text-align: center;
  /* border: 1px solid black; */
  background-color: #ddd;
  border: 1px solid #ddd;
  text-transform: uppercase;
  /* padding: 5px; */
  cursor: pointer;
  &:hover {
    /* color: black;
    background-color: #ccc; */
    border: 1px solid black;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 19%;
  height: 18%;
`;

const Found = styled(Base)`
  color: ${(props) => textColorMatch[props.color]};
  background-color: ${(props) => teamColorMatch[props.color]};
  border: 1px solid ${(props) => teamColorMatch[props.color]};
`;

const SpymasterUnfound = styled(Base)`
  color: ${(props) => unfoundTeamColorMatch[props.color]};
  background-color: #ccc;
  border: 1px solid #ccc;
`;

const textColorMatch = {
  red: 'white',
  blue: 'white',
  neutral: 'black',
  black: 'white',
};

const teamColorMatch = {
  red: '#d13030',
  blue: '#4183cc',
  neutral: '#f9e4b7',
  black: 'black',
};

const unfoundTeamColorMatch = {
  ...teamColorMatch,
  neutral: '#be8200',
};

export default class Card extends Component {
  render() {
    const { tabIndex, children, found, color, spymaster, onClick, inverted } = this.props;

    const props = { tabIndex: tabIndex, color, onClick, inverted };
    if (spymaster) {
      if (found === inverted) {
        return <SpymasterUnfound {...props}>{children}</SpymasterUnfound>;
      }
      else {
        return <Found {...props}>{children}</Found>;
      }
    } else {
      if (found) {
        return <Found {...props}>{children}</Found>;
      } else {
        return <Base {...props}>{children}</Base>;
      }
    }
  }
}
