import React from 'react';
import logo from './logo.svg';
import './App.css';
import Question from '../question/QuestionAnswer'
import { escapeHTML, mergeShuffleAnswers } from '../../utils';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { started: false, questions: [], loaded: false, current: 0, score: 0 };
    this.startQuiz = this.startQuiz.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.restart = this.restart.bind(this);
  }

  loadApp() {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => console.log(networkError.message))
      .then(jsonResponse => {
        const questions = jsonResponse.results.map(q => {
          q.question = escapeHTML(q.question);
          q.answers = mergeShuffleAnswers(q.correct_answer, q.incorrect_answers);
          return q;
        });
        this.setState({ questions, loaded: true });
      })
  }

  restart() {
    this.setState({ started: false, loaded: false, current: 0, score: 0 });
    this.loadApp();
  }

  startQuiz() {
    this.setState({ started: true })
  }

  nextQuestion() {
    this.setState(prevState => ({ current: prevState.current + 1 }));
  }

  checkAnswer(answer) {
    const { questions, current } = this.state;
    const question = questions[current];
    if (answer === question.correct_answer) {
      this.setState(prevState => ({ score: prevState.score + 1 }));
      return true;
    }
    return false;
  }

  printScore = () => {
    const isfinished = this.state.questions.length === this.state.current;

    return (<div>
      {isfinished && <span>Final </span>}Score: {this.state.score} / {this.state.questions.length}
      <br />
      {isfinished && <button className="App-button" onClick={this.restart}>Restart</button>}
    </div>);
  };

  renderQuestion() {
    const { questions, current } = this.state;
    if (current < questions.length) {
      const question = questions[current];
      return <Question question={question} index={current} nextQuestion={this.nextQuestion} checkAnswer={this.checkAnswer} printScore={this.printScore} />;
    } else {
      return this.printScore();
    }
  }

  getQuiz() {
    return !this.state.started ?
      (
        <button onClick={this.startQuiz} className="App-button" disabled={!this.state.loaded}>
          {this.state.loaded ? 'Start' : 'loading...'}
        </button>
      )
      :
      (<div>
        {this.renderQuestion()}
      </div>);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 style={{color:'#62dafb'}}>Quiz App</h2>
          <cite>(Using React & Open Trivia API)</cite>
          <img src={logo} className="App-logo" alt="logo" />
          {this.getQuiz()}
        </header >
        <footer>
          <cite>find me o twitter <a className='App-link' href={'https://twitter.com/rameezjoya'} target='_blank' rel='noopener noreferrer'>@rameezjoya</a></cite>
        </footer>
      </div >
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((nextState.current === 0 && nextState.score === 0) || nextState.current > this.state.current) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.loadApp();
  }

}

export default App;
