const randomChoice = (choices) => {
    return choices[Math.floor(Math.random() * choices.length)];
}

const randomRange = (min, max) => {
    return min + Math.random() * (max - min);
}