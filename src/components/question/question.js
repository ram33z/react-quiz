import React, { Component } from 'react';

const Answer = props => {

    function answerClick(e) {
        if (typeof props.clicked !== 'string') {
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
    }

    answerClick(answer) {
        if (!this.state.answered) {
            let isCorrect = this.props.checkAnswer(answer);
            this.setState({ answered: true, isCorrect, answer });
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({ answered: false, isCorrect: false, answer: '' });
    }

    render() {


        return (<div>
            {this.props.printScore()}
            <p>{this.props.index+1}) {this.props.question.question}</p>

            <ul className="answers">
                {this.props.question.answers.map((a, i) => <Answer key={i}
                    answer={a}
                    clicked={!this.state.answered ? this.answerClick : ''}
                    className={this.state.answered ? this.state.answer === a ? this.state.isCorrect ? 'correct' : 'incorrect' : 'disabled' : ''}
                />)}
            </ul>
            <br />
            {this.state.answered ? <button className="App-button" onClick={this.props.nextQuestion}>next</button> : <br />}

        </div>);
    }
}

export default Question;