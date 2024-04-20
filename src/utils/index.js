export function formatDigits(value) {
    let prefix = "";
    if (value < 10) {
        prefix = "00";
    } else if (value < 100) {
        prefix = "0";
    }

    return prefix + value;
}

export const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const areNumbers = (num1, num2) => {
    return typeof num1 === "number" && typeof num2 === "number";
};

export const generateRandomNumber = (min, max, step = 10) => {
    // Calculate the range of numbers
    const range = max - min;
    
    // Calculate the number of increments within the range
    const numIncrements = Math.floor(range / step);
    
    // Generate a random number between 0 and numIncrements
    const randomIncrement = Math.floor(Math.random() * (numIncrements + 1));
    
    // Calculate the final random number
    const randomNumber = min + (randomIncrement * step);
    
    return randomNumber;
};

export const countEqualParams = (currentSettings, displaySettings) => {
    let score = 0;
    for (const param in displaySettings) {
        if (currentSettings[param] === displaySettings[param]) {
            score++;
        }
    } 
    return score;
};

export const calcResult = (correct, incorrect) => {
    return Math.round((correct / (correct + incorrect)) * 100) + "%";
};