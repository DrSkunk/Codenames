import React, { Component } from 'react';
import styled from 'styled-components';
import i18n from './i18n';

const Text = styled.span`
  margin-right: 5px;
`;

const Input = styled.input`
  width: 30px;
`;

export default class Timer extends Component {
  constructor(props) {
    super(props);
    let totalTime = parseInt(localStorage.getItem('totalTime'));
    if (isNaN(totalTime)) {
      totalTime = 180;
    }
    this.state = {
      remainingTime: totalTime,
      totalTime,
      timerIsRunning: false,
    };
  }

  start = () => {
    this.timer = setInterval(() => {
      this.setState((timerState) => {
        const remainingTime = timerState.remainingTime - 1;
        if (remainingTime <= 0) {
          clearInterval(this.timer);
          return { timerIsRunning: false, remainingTime: 0 };
        }
        return { remainingTime };
      });
    }, 1000);
    this.setState({ timerIsRunning: true });
  };

  pause = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({ timerIsRunning: false });
  };

  reset = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState((state) => ({
      timerIsRunning: false,
      remainingTime: state.totalTime,
    }));
  };

  onTotalTimeChange = (e) => {
    const totalTime = e.target.value;
    localStorage.setItem('totalTime', totalTime);
    this.setState((state) => {
      if (!state.timerIsRunning) {
        return { totalTime };
      }
    });
  };

  render() {
    const { language } = this.props;
    const { timerIsRunning, remainingTime, totalTime } = this.state;
    return (
      <div>
        <Text>{this.state.remainingTime}</Text>
        <button onClick={this.reset}>{i18n[language].reset_timer}</button>
        <button
          onClick={this.start}
          disabled={timerIsRunning || remainingTime === 0}
        >
          {i18n[language].start_timer}
        </button>
        <button onClick={this.pause} disabled={!timerIsRunning}>
          {i18n[language].pause_timer}
        </button>
        <Input
          type="number"
          value={totalTime}
          onChange={this.onTotalTimeChange}
          disabled={timerIsRunning}
        />
      </div>
    );
  }
}
