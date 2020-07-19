import React, { Component } from 'react';

const Answer = props => {

    function answerClick(e) {
        console.log(typeof props.clicked);
        if (typeof props.clicked !== 'string') {
            console.log(e.target.innerText);
            props.clicked(e.target.innerText);
        }
    }

    return (
        <li onClick={answerClick} className={props.className}>{props.answer}</li>
    )
}

class Question extends Component {

    constructor(props) {
        super(props);
        this.state = { answered: false, isCorrect: false, answer: '' };
        this.answerClick = this.answerClick.bind(this);
        this.loadNewQuestion(props);
    }

    answerClick(answer) {
        if (!this.state.answered) {
            console.log('me;');
            let isCorrect = this.props.checkAnswer(answer);
            this.setState({ answered: true, isCorrect, answer });
        }
    }

    componentWillReceiveProps(newProps) {
        this.loadNewQuestion(newProps);
        this.setState({ answered: false, isCorrect: false, answer: '' });
    }

    loadNewQuestion(props) {
        this.question = props.question.question;
        this.answers = props.question.answers;
    }

    render() {


        return (<div>
            {this.props.printScore()}
            <p>{this.question}</p>

            <ul className="answers">
                {this.answers.map((a, i) => <Answer key={i}
                    answer={a}
                    clicked={!this.state.answered ? this.answerClick : ''}
                    className={this.state.answered ? this.state.answer === a ? this.state.isCorrect ? 'correct' : 'incorrect' : 'disabled' : ''}
                />)}
            </ul>
            <br/>
            {this.state.answered ? <button className="App-button" onClick={this.props.nextQuestion}>next</button> : <br/>}
            
        </div>);
    }
}

export default Question;