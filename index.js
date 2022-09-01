const display = document.querySelector('.calculator__screen p');
const memoryBlock = document.querySelector('.memory');
const calculatorBtns =document.querySelector('.calculator__buttons');
let firstNumber = '';
let secondNumber = '';
let operator = '';
let finish = false;
let prevSecondNum = '';
let prevOperator = '';
let memory = 0;

function containsClassList(str, current) {
	return current.classList.contains(str);
}

memoryBlock.onclick = (event) => {
	const current = event.target;

	if (!containsClassList('memory-btn', current)) {
		return;
	}

	if (containsClassList('mc', current)) {
		memory = 0;
	}

	if (containsClassList('mr', current)) {
		if (memory !== 0) {
			display.textContent = memory;
		}
	}

	if (containsClassList('plus', current)) {
		memory += +display.textContent;
	}

	if (containsClassList('minus', current)) {
		memory -= +display.textContent;
	}
}

function clearAll() {
	firstNumber = '';
	secondNumber = '';
	operator = '';
	finish = false;
	prevSecondNum = '';
	prevOperator = '';
	display.textContent = '0';
}

function undoLast() {
	const displayContent = display.textContent;
	const displayLength = display.textContent.length;
	const withMinus = displayLength > 2 && displayContent[0] === '-';
	const withoutMinus = displayLength > 1 && displayContent[0] !== '-';
	const condition = withoutMinus || withMinus;
	
		if (condition && !finish) {
			display.textContent = displayContent.slice(0, displayLength - 1);

			if (secondNumber !== '') {
				secondNumber = display.textContent;
			} else {
				firstNumber = display.textContent;
			}
		} else if (finish) {
			return;
		} else {
			display.textContent = '0';
		
			if (secondNumber !== '') {
				secondNumber = '';
			} else {
				firstNumber = '';
			}
		}
}

function plusMinus() {
	const minus = '-';
	const displayContent = display.textContent;
	
	if (+displayContent >= 0) {
		display.textContent = minus.concat(displayContent);
	} else {
		display.textContent = displayContent.slice(1);
	}

	if (secondNumber === '' && finish) {
		secondNumber = prevSecondNum;
		finish = false;
	} else if (secondNumber !== '') {
		secondNumber = display.textContent;
	} else {
		firstNumber = display.textContent;
	}

	return;
}


function clickOperand(current) {
	const condition = firstNumber !== '' && secondNumber !== '' && finish;

	if (condition && operator !== '') {
		firstNumber = '';
		secondNumber = '';
		operator = '';
		finish = false;
	}

	if (secondNumber === '' && operator === '') {
		if (firstNumber.length < 15) {
			firstNumber += current;
		}

		display.textContent = firstNumber;
	} else if (condition) {
		secondNumber = current;
		finish = false;
		display.textContent = secondNumber;
	} else {
		if (secondNumber.length < 15) {
			secondNumber += current;
		}
		
		display.textContent = secondNumber;
	}
	
	return;
}

function clickOperator(current) {
	const condition = firstNumber !== '' && operator !== '' && secondNumber !== '' && finish;
	
	if (condition) {
		secondNumber = '';
		finish = false;
	}

	if (firstNumber !== '' && firstNumber !== display.textContent) {
		firstNumber = display.textContent;
	}

	operator = current;

	return;
}

function result() {
		if (secondNumber === '') {
			if (operator === '' && firstNumber !== '') {
				operator = prevOperator;
				secondNumber = prevSecondNum;
			} else {
				secondNumber = firstNumber;
			}
		}

		prevSecondNum = secondNumber;
		prevOperator = operator;

		switch (operator) {
			case '+':
				firstNumber = (+firstNumber) + (+secondNumber);

				break;
			case '-':
				firstNumber = firstNumber - secondNumber;

				break;
			case 'x':
				firstNumber = firstNumber * secondNumber;
				
				break;
			case '÷':
				if (+secondNumber === 0) {
					display.textContent = 'ERROR';
					firstNumber = '';
					secondNumber = '';
					operator = '';
					finish = false;
					prevOperator = '';
					prevSecondNum = '';

					break;
				}

				firstNumber = firstNumber / secondNumber;

				const condition = (firstNumber + '').length > 10;

				if (!Number.isInteger(firstNumber) && condition) {
						firstNumber =  firstNumber.toFixed(8);
				}

				break;
		}

		const condition = (firstNumber + '').length > 15;
		const isInt = Number.isInteger(firstNumber);
		finish = true;

		if (condition && isInt) {
			firstNumber = firstNumber.toExponential(8);
		}

		if (firstNumber !== '') {
			display.textContent = firstNumber;
		}
}

calculatorBtns.onclick = (event) => {
	const currentElem = event.target;
	const current = event.target.textContent;

	if (!containsClassList('btn', currentElem)) {
		return;
	}

	if (containsClassList('clear', currentElem)) {
		clearAll();
	}

	if (containsClassList('plus-minus', currentElem)) {
		plusMinus();
	}

	if (containsClassList('undo', currentElem)) {
		undoLast();
	}
	
	if (containsClassList('operand', currentElem)) {
		clickOperand(current);
	}
	
	if (containsClassList('operator', currentElem)) {
		const condition = operator !== '' && !finish && firstNumber !== '' && secondNumber !== '';
		
		if (condition) {
			result();
		}

		clickOperator(current);
	}

	if (containsClassList('res', currentElem)) {
		result();
	}
}