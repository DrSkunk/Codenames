import React, { Component } from 'react';
import styled from 'styled-components';
import i18n from './i18n';
const Wrapper = styled.div`
  margin-top: 10px;
`;


export default class GameSetter extends Component {

  constructor(props) {
    super(props);
    this.state = {words: ''};

    this.handleChange = this.handleChange.bind(this);
    this.startGame = this.startGame.bind(this);
    this.props.startNewGame.bind(this);
  }

  handleChange(event) {
    this.setState({words: event.target.value});
  }

  startGame() {
    var wordArray = this.state.words.split(',');
    if (wordArray.length < 25) {
      wordArray = null;
    }
    this.props.startNewGame(wordArray);
  }

  render() {
      return (
        <Wrapper>
            <button onClick={this.startGame}>{i18n[this.props.language].new_game}</button>
            <div>{i18n[this.props.language].use_custom_words}</div>
            <textarea 
              placeholder={i18n[this.props.language].custom_words_placeholder} 
              name="textarea" 
              value={this.state.words} 
              cols='96' rows='4'
              onChange={this.handleChange}/>
        </Wrapper>
      );       

  }
}