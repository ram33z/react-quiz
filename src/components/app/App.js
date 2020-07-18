import React from 'react';
import logo from './logo.svg';
import './App.css';
import { escapeHTML, mergeShuffleAnswers } from '../../utils';

const Question = props => {
  const question = escapeHTML(props.question.question);
  const answers = mergeShuffleAnswers(props.question.correct_answer, props.question.incorrect_answers);
  return (<div>
    <p>{question}</p>

    <ul>
      {answers.map((a, i) => <Answer key={i} answer={a} />)}
    </ul>

    <button className="App-button" onClick={props.nextQuestion}>next</button>
  </div>);
}

const Answer = props => {
  return (
    <li>{props.answer}</li>
  )
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { started: false, questions: [], loaded: false, nextQuestion: 0 };
    this.startQuiz = this.startQuiz.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
  }

  startQuiz() {
    this.setState({ started: true })
  }

  nextQuestion() {
    this.setState(prevState => ({ nextQuestion: prevState.nextQuestion + 1 }));
  }

  renderQuestion() {
    const { questions, nextQuestion } = this.state;
    if (nextQuestion < questions.length) {
      const question = questions[nextQuestion];
      return <Question question={question} nextQuestion={this.nextQuestion} />;
    } else {
      return <div>End</div>;
    }

  }

  getQuiz() {
    return !this.state.started ?
      (
        <button onClick={this.startQuiz} className="App-button" disabled={!this.state.loaded}>
          {this.state.loaded ? 'Start' : 'loading'}
        </button>
      )
      :
      (this.renderQuestion());
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.getQuiz()}
        </header >
      </div >
    )
  }

  componentDidMount() {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => console.log(networkError.message))
      .then(jsonResponse => this.setState({ questions: jsonResponse.results, loaded: true }))
  }

}

export default App;
