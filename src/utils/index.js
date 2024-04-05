export function formatHeading(heading) {
    let prefix = "";
    if (heading < 10) {
        prefix = "00";
    } else if (heading < 100) {
        prefix = "0";
    }

    return prefix + heading;
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