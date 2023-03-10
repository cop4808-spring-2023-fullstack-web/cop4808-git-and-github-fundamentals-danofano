let displayValue = '0';
let firstOperand = null;
let secondOperand = null;
let firstOperator = null;
let secondOperator = null;
let result = null;
const buttons = document.querySelectorAll('button');

window.addEventListener('keydown', function(e){
    const key = document.querySelector(`button[data-key='${e.key}']`);
    //console.log("Keypressed = ", key, "Key = ", e.key);

    if (key != null)
        key.click();
    else 
        console.log("Unsupported key was pressed= ", e.key);
});

function updateDisplay() {
    const display = document.getElementById('display');
    display.innerText = displayValue;
    if(displayValue.length > 9) {
        console.log(displayValue.length)
        display.innerText = displayValue.substring(0, 9);
    }
}
  
updateDisplay();


// To select from data-key: document.querySelector([`[data-key="${"="}"]`]) 
// buttons[i].classList.contains('operand'))
function clickButton() {
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            if(buttons[i].classList.contains('operand')) {
                inputOperand(buttons[i].value);
                updateDisplay();
            } else if(buttons[i].classList.contains('operator')) {
                inputOperator(buttons[i].value);
            } else if(buttons[i].classList.contains('equals')) {
                inputEquals();
                updateDisplay();
            } else if(buttons[i].classList.contains('decimal')) {
                inputDecimal(buttons[i].value);
                updateDisplay();
            } else if(buttons[i].classList.contains('percent')) {
                inputPercent(displayValue);
                updateDisplay();
            } else if(buttons[i].classList.contains('sign')) {
                inputSign(displayValue);
                updateDisplay();
            } else if(buttons[i].classList.contains('clear')) {
                clearDisplay();
                updateDisplay();
            } else if(buttons[i].classList.contains('ln')) {   // functionality for natural log 
                inputNaturalLog(displayValue);
                updateDisplay();
            } else if(buttons[i].classList.contains('log')) {  // functionality for log
                inputLog(displayValue);
                updateDisplay();
            } else if(buttons[i].classList.contains('sqrt')) {  // functionality for square root
                inputSqrt(displayValue);
                updateDisplay();
            } else if(buttons[i].classList.contains('exponent')) {  // functionality for power of 2
                inputExponent(displayValue);
                updateDisplay();
            }
        }
    )}
}

clickButton();

function inputOperand(operand) {
    if(firstOperator === null) {
        if(displayValue === '0' || displayValue === 0) {
            //1st click - handles first operand input
            displayValue = operand;
            firstOperand = displayValue;
        } else if(displayValue === firstOperand) {
            //starts new operation after inputEquals()
            displayValue += operand;
            firstOperand = displayValue;
        } else {
            displayValue = operand;
        }
    } else {
        //3rd/5th click - inputs to secondOperand
        // will only execute when you are entering the operand after the operator
        if (secondOperand !== null)
            displayValue += operand;
        else if (displayValue === firstOperand) {
            secondOperand = displayValue;
            displayValue = operand;
        }             
        else {
            displayValue += operand;
        }
    }
}


function inputOperator(operator) {
    if(firstOperator != null && secondOperator === null) {
        //4th click - handles input of second operator
        secondOperator = operator;
        secondOperand = displayValue;
        result = operate(Number(firstOperand), Number(secondOperand), firstOperator);
        // passed 10 in the argument of roundAccurately instead of 15 which fixed the issue of entering 9 digit numbers and getting a wrong output
        displayValue = roundAccurately(result, 10).toString();  
        firstOperand = displayValue;
        result = null;
    } else if(firstOperator != null && secondOperator != null) {
        //6th click - new secondOperator
        secondOperand = displayValue;
        result = operate(Number(firstOperand), Number(secondOperand), secondOperator);
        secondOperator = operator;
        displayValue = roundAccurately(result, 10).toString();
        firstOperand = displayValue;
        result = null;
    } else { 
        //2nd click - handles first operator input
        firstOperator = operator;
        firstOperand = displayValue;
    }
}

function inputEquals() {
    //hitting equals doesn't display undefined before operate()
    if(firstOperator === null) {
        displayValue = displayValue;
    } else if(secondOperator != null) {
        //handles final result
        secondOperand = displayValue;
        result = operate(Number(firstOperand), Number(secondOperand), secondOperator);
        if(result === 'lmao') {
            displayValue = 'lmao';
        } else {
            displayValue = roundAccurately(result, 10).toString();
            firstOperand = displayValue;
            secondOperand = null;
            firstOperator = null;
            secondOperator = null;
            result = null;
        }
    } else {
        //handles first operation
        secondOperand = displayValue;
        result = operate(Number(firstOperand), Number(secondOperand), firstOperator);
        if(result === 'lmao') {
            displayValue = 'lmao';
        } else {
            displayValue = roundAccurately(result, 10).toString();
            firstOperand = displayValue;
            secondOperand = null;
            firstOperator = null;
            secondOperator = null;
            result = null;
        }
    }
}

function inputDecimal(dot) {
    if(displayValue === firstOperand || displayValue === secondOperand) {
        displayValue = '0';
        displayValue += dot;
    } else if(!displayValue.includes(dot)) {
        displayValue += dot;
    } 
}

function inputPercent(num) {
    displayValue = (num/100).toString();
}

function inputSign(num) {
    displayValue = (num * -1).toString();
}

function clearDisplay() {
    displayValue = '0';
    firstOperand = null;
    secondOperand = null;
    firstOperator = null;
    secondOperator = null;
    result = null;
}

// natural log
function inputNaturalLog(num) {
    displayValue = (Math.log(num)).toString();
}

// log base 10
function inputLog(num) {
    displayValue = (Math.log10(num)).toString();
}

// square root
function inputSqrt(num) {
    displayValue = (Math.sqrt(num)).toString();
}

// exponent (power of 2)
function inputExponent(num) {
    displayValue = (num ** 2).toString();
}

function inputBackspace() {
    if(firstOperand != null) {
        firstOperand = null;
        updateDisplay();
    }
}

function operate(x, y, op) {
    if(op === '+') {
        return x + y;
    } else if(op === '-') {
        return x - y;
    } else if(op === '*') {
        return x * y;
    } else if(op === '/') {
        if(y === 0) {
            return 'lmao';
        } else {
        return x / y;
        }
    }
}

function roundAccurately(num, places) {
    return parseFloat(Math.round(num + 'e' + places) + 'e-' + places);
}