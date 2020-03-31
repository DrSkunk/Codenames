import React, { Component } from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import wordList from './words';
import shuffleSeed from 'shuffle-seed';
import Card from './Card';
import i18n from './i18n';

function saveGame(state) {
  localStorage.setItem('savedGame', JSON.stringify(state));
}

function startNewGame() {
  window.location.replace(
    window.location.origin + window.location.pathname + '?seed=' + nanoid()
  );
}

// https://stackoverflow.com/questions/486896/adding-a-parameter-to-the-url-with-javascript
function insertParam(key, value) {
  key = encodeURI(key);
  value = encodeURI(value);

  var kvp = document.location.search.substr(1).split('&');

  var i = kvp.length;
  var x;
  while (i--) {
    x = kvp[i].split('=');

    if (x[0] === key) {
      x[1] = value;
      kvp[i] = x.join('=');
      break;
    }
  }

  if (i < 0) {
    kvp[kvp.length] = [key, value].join('=');
  }

  //this will reload the page, it's likely better to store this until finished
  const newUrl = window.location.origin + '?' + kvp.join('&');
  window.history.replaceState(null, null, newUrl);
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 500px;
`;

export default class App extends Component {
  constructor(props) {
    super(props);
    const searchParams = new URL(window.location).searchParams;
    const seed = searchParams.get('seed');
    if (!seed) {
      startNewGame();
    }

    let language = searchParams.get('language');
    if (language === null) {
      language = 'nl';
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
      this.state = this.initGame(seed, language);
    }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    localStorage.removeItem('savedGame');
  }

  initGame(seed, language) {
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

    const words = language === 'eng' ? wordList.english : wordList.dutch;
    const cards = shuffleSeed
      .shuffle(words, seed)
      .slice(0, 25)
      .map((word, i) => ({ word, found: false, color: colors[i] }));
    const state = { seed, cards, spymaster: false, redScore: 0, blueScore: 0 };
    const score = this.calculateScore(state);
    state.redScore = score.redScore;
    state.blueScore = score.blueScore;
    state.language = language;
    return state;
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
      newState.cards[i].found = true;
      const score = this.calculateScore(newState);
      newState.redScore = score.redScore;
      newState.blueScore = score.blueScore;
      saveGame(newState);
      return newState;
    });
  };

  changeLanguage = language => {
    insertParam('language', language);
    const newState = this.initGame(this.state.seed, language);
    this.setState(newState);
    saveGame(newState);
  };

  render() {
    const { redScore, blueScore, cards, spymaster, language } = this.state;
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
        <button
          onClick={() => this.changeLanguage('eng')}
          disabled={language === 'eng'}
        >
          ENG
        </button>
        <button
          onClick={() => this.changeLanguage('nl')}
          disabled={language === 'nl'}
        >
          NL
        </button>
        <Score>
          <span style={{ color: '#4183cc' }}>{blueScore}</span> -{' '}
          <span style={{ color: '#d13030' }}>{redScore}</span>
        </Score>
        <Board>{cardComponents}</Board>
        <button onClick={this.toggleSpymaster}>
          {spymaster
            ? i18n[language].turn_off_spymaster
            : i18n[language].turn_on_spymaster}
        </button>
        <button onClick={startNewGame}>{i18n[language].new_game}</button>
      </Game>
    );
  }
}
