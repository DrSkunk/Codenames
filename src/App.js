import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { nanoid } from 'nanoid';
import wordList from './words';
import shuffleSeed from 'shuffle-seed';
import Card from './Card';

function saveGame(state) {
  localStorage.setItem('savedGame', JSON.stringify(state));
}

function startNewGame() {
  window.location.replace(
    window.location.origin + window.location.pathname + '?seed=' + nanoid()
  );
}

const Game = styled.div`
  width: 700px;
  margin: 0 auto;
`;
const Score = styled.div`
  font-size: 1.5em;
  margin: 10px 0;
`;
const Board = styled.div`
  /* display: grid;
  grid-template-columns: repeat(5, 100px);
  grid-gap: 10px; */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 500px;
`;
export default class App extends Component {
  constructor(props) {
    super(props);
    const seed = new URL(window.location).searchParams.get('seed');
    if (!seed) {
      startNewGame();
    }
    try {
      const savedGame = JSON.parse(localStorage.getItem('savedGame'));
      if (
        savedGame === null ||
        savedGame.seed !== seed ||
        !savedGame.redScore ||
        !savedGame.blueScore ||
        !savedGame.cards
      ) {
        throw new Error('Invalid game saved');
      }
      this.state = savedGame;
    } catch (error) {
      this.initGame(seed);
    }
    /*
    if (savedGame !== null && savedGame.seed === seed) {
    } else {
      this.initGame();
    }*/
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    localStorage.removeItem('savedGame');
  }

  initGame(seed) {
    let colors = [
      'red',
      'red',
      'red',
      'red',
      'red',
      'red',
      'red',
      'red',
      'blue',
      'blue',
      'blue',
      'blue',
      'blue',
      'blue',
      'blue',
      'blue',
      'black',
      'neutral',
      'neutral',
      'neutral',
      'neutral',
      'neutral',
      'neutral',
      'neutral'
    ];
    colors = [
      ...colors,
      shuffleSeed.shuffle(['red', 'blue'], seed).slice(0, 1)[0]
    ];
    colors = shuffleSeed.shuffle(colors, seed);
    console.log('colors', colors);
    const cards = shuffleSeed
      .shuffle(wordList.dutch, seed)
      .slice(0, 25)
      .map((word, i) => ({ word, found: false, color: colors[i] }));
    this.state = { seed, cards, spymaster: false, redScore: 0, blueScore: 0 };
    const score = this.calculateScore(this.state);
    this.state.redScore = score.redScore;
    this.state.blueScore = score.blueScore;
  }

  toggleSpymaster = () => {
    this.setState(state => {
      const newState = {
        spymaster: !state.spymaster
      };
      saveGame(newState);
      return newState;
    });
  };

  calculateScore = state => {
    let redCount = 0;
    let redFound = 0;
    let blueCount = 0;
    let blueFound = 0;
    state.cards.forEach(card => {
      if (card.color === 'red') {
        redCount += 1;
        if (card.found) {
          redFound += 1;
        }
      } else if (card.color === 'blue') {
        blueCount += 1;
        if (card.found) {
          blueFound += 1;
        }
      }
    });
    return {
      redScore: redCount - redFound,
      blueScore: blueCount - blueFound
    };
  };

  onCardClick = i => {
    this.setState(state => {
      const newState = JSON.parse(JSON.stringify(state));
      console.log('newState', newState);
      newState.cards[i].found = true;
      const score = this.calculateScore(newState);
      newState.redScore = score.redScore;
      newState.blueScore = score.blueScore;
      saveGame(newState);
      return newState;
    });
  };

  render() {
    const { redScore, blueScore, cards, spymaster } = this.state;
    const cardComponents = cards.map((card, i) => (
      <Card
        spymaster={spymaster}
        key={card.word}
        color={card.color}
        found={card.found}
        tabIndex={i}
        onClick={() => this.onCardClick(i)}
      >
        {card.word}
      </Card>
    ));

    return (
      <Game>
        <Score>
          <span style={{ color: '#4183cc' }}>{blueScore}</span> -{' '}
          <span style={{ color: '#d13030' }}>{redScore}</span>
        </Score>
        <Board>{cardComponents}</Board>
        <button onClick={this.toggleSpymaster}>
          Spymaster {spymaster ? 'uit' : 'aan'}zetten
        </button>
        <button onClick={startNewGame}>Start nieuw spel</button>
      </Game>
    );
  }
}
