
const parser = new DOMParser();

export const escapeHTML = str => {
    return parser.parseFromString(str, 'text/html').body.textContent;
}


export const mergeShuffleAnswers = (correct, incorrectList) => {
    let answers = incorrectList.map(a => escapeHTML(a));
    correct = escapeHTML(correct);
    return [...answers, correct];
}