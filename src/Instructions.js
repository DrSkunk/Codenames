import React, { Component } from 'react';
import styled from 'styled-components';
import i18n from './i18n';
const Wrapper = styled.div`
  margin-top: 10px;
`;

const Text = styled.div`
  margin-top: 10px;
  margin-left: 5px;
`;

const OfficialRules = styled.a`
  color: ${(props) => (props.darkMode ? 'white' : 'black')};
  display: block;
  margin-top: 10px;
  margin-left: 5px;

  &:hover {
    text-decoration: underline;
  }

  &:active {
    color: ${(props) => (props.darkMode ? 'white' : 'black')};
  }

  &:visited {
    color: ${(props) => (props.darkMode ? 'white' : 'black')};
  }
`;

export default class Instructions extends Component {
  state = {
    isVisible: false,
  };

  toggleVisibility = () => {
    this.setState((state) => ({ isVisible: !state.isVisible }));
  };

  render() {
    const { language, darkMode } = this.props;
    const { isVisible } = this.state;
    return (
      <Wrapper>
        <button onClick={this.toggleVisibility}>
          {isVisible
            ? i18n[language].hide_instructions
            : i18n[language].show_instructions}
        </button>
        {isVisible ? <Text>{i18n[language].instructions}</Text> : null}
        <OfficialRules
          href={i18n[language].instructions_link}
          target="_blank"
          rel="noopener noreferrer"
          darkMode={darkMode}
        >
          {i18n[language].official_rules}
        </OfficialRules>
      </Wrapper>
    );
  }
}
