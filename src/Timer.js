import React, { Component } from 'react';
import styled from 'styled-components';
import i18n from './i18n';

const totalTime = 6;

const Text = styled.span`
  margin-left: 5px;
`;

export default class Timer extends Component {
  state = {
    remainingTime: totalTime,
    timerIsRunning: false,
  };

  toggleTimer = () => {
    console.log(this.state.timerIsRunning);
    if (this.state.timerIsRunning) {
      console.log('Clear timer');
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.setState({ timerIsRunning: false, remainingTime: totalTime });
    } else {
      console.log('Start timer');

      this.setState((state) => {
        if (state.remainingTime <= 0) {
          clearInterval(this.timer);
          return { timerIsRunning: false, remainingTime: totalTime };
        }
      });

      this.timer = setInterval(() => {
        this.setState((timerState) => {
          const remainingTime = timerState.remainingTime - 1;
          if (remainingTime <= 0) {
            clearInterval(this.timer);
            return { timerIsRunning: false, remainingTime: 0 };
          }
          return { remainingTime };
        });
        console.log('Tick');
      }, 1000);
      this.setState({ timerIsRunning: true });
    }
  };

  render() {
    const { language } = this.props;
    const { timerIsRunning, remainingTime } = this.state;
    return (
      <div>
        <button onClick={this.toggleTimer}>
          {timerIsRunning || remainingTime <= 0
            ? i18n[language].reset_timer
            : i18n[language].turn_on_timer}
        </button>
        <Text>{this.state.remainingTime}</Text>
      </div>
    );
  }
}
