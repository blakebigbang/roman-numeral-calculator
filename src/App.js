import React, { useState } from "react";
import styled from "@emotion/styled";

import NUMERALS from "./data/NUMERALS";
import OPERATIONS, { OPERATIONS_KEYS } from "./data/OPERATIONS";
import convert from "./utils/convert";

const BUTTON_TYPES = {
  EDIT: "EDIT",
  OPERATION: "OPERATION",
  NUMERAL: "NUMERAL"
};

const Button = styled.button`
  border: none;
  background: none;
  color: #fff;
  font-size: 3rem;
  &:focus {
    outline: none;
  }
  background-color: ${props => {
    if (props.buttonType === BUTTON_TYPES.EDIT) {
      return `#414246`;
    } else if (props.buttonType === BUTTON_TYPES.OPERATION) {
      return `#FF9F0A`;
    } else if (props.buttonType === BUTTON_TYPES.NUMERAL) {
      return `#5D6365`;
    }
  }};
`;
const Input = styled.input`
  display: block;
  width: 100%;
  background-color: #2a3131;
  border: none;
  color: #fff;
  font-size: 5rem;
  padding: 2rem;
  padding-top: 4rem;

  outline: none;
  text-align: right;
`;

const RootContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const RootButtonsContainer = styled.div`
  flex: 1;

  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 100%;
  grid-column-gap: 0.15rem;
  grid-row-gap: 0.15rem;

  background-color: #2e3236;
`;

const MainButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr 4fr;
  grid-column-gap: 0.15rem;
  grid-row-gap: 0.15rem;
`;
const EditOperationButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 100%;
  grid-column-gap: 0.15rem;
  grid-row-gap: 0.15rem;
`;
const NumeralButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-column-gap: 0.15rem;
  grid-row-gap: 0.15rem;
`;

const OperationButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 0.15rem;
  grid-row-gap: 0.15rem;
`;

function App() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [operationMode, setOperationMode] = useState();
  const [previousOperation, setPreviousOperation] = useState();

  return (
    <RootContainer>
      {!operationMode || operationMode === OPERATIONS_KEYS.EQUALS ? (
        <Input value={first} readOnly />
      ) : (
        <Input value={second} readOnly />
      )}

      <RootButtonsContainer>
        <MainButtonsContainer>
          <EditOperationButtonsContainer>
            <Button
              buttonType={BUTTON_TYPES.EDIT}
              onClick={() => {
                if (!first && !second) {
                  return;
                } else if (first && !operationMode && !second) {
                  return setFirst("");
                } else if (first && operationMode && !second) {
                  return setOperationMode();
                } else if (first && !operationMode && second) {
                  // impossible
                } else if (first && operationMode && second) {
                  return setSecond("");
                }
              }}
            >
              CLEAR
            </Button>

            {((!operationMode && first.length > 0) ||
              (operationMode && second.length > 0)) && (
              <Button
                buttonType={BUTTON_TYPES.EDIT}
                onClick={() => {
                  if (!operationMode) {
                    return setFirst(first.substr(0, first.length - 1));
                  }

                  return setSecond(second.substr(0, second.length - 1));
                }}
              >
                DELETE
              </Button>
            )}
          </EditOperationButtonsContainer>

          <NumeralButtonsContainer>
            {Object.keys(NUMERALS).map(numeral => (
              <Button
                key={numeral}
                buttonType={BUTTON_TYPES.NUMERAL}
                onClick={() => {
                  console.log(numeral, NUMERALS[numeral].value);

                  if (!operationMode) return setFirst(`${first}${numeral}`);
                  return setSecond(`${second}${numeral}`);
                }}
              >
                {numeral}
              </Button>
            ))}
          </NumeralButtonsContainer>
        </MainButtonsContainer>

        <OperationButtonsContainer>
          {Object.keys(OPERATIONS).map(opKey => (
            <Button
              key={opKey}
              buttonType={BUTTON_TYPES.OPERATION}
              onClick={() => {
                // console.log(opKey, OPERATIONS[opKey].symbol);

                if (
                  [
                    OPERATIONS_KEYS.ADD,
                    OPERATIONS_KEYS.SUBTRACT,
                    OPERATIONS_KEYS.MULTIPLY,
                    OPERATIONS_KEYS.DIVIDE
                  ].includes(opKey)
                ) {
                  // check to see if valid: first input has valid value
                  const {
                    isValid: isFirstIntValid,
                    message: firstIntMessage
                  } = convert(first);

                  // if not, stop here and alert
                  if (!isFirstIntValid) {
                    return alert(`${firstIntMessage}`);
                  }

                  setPreviousOperation();
                } else if (opKey === OPERATIONS_KEYS.EQUALS) {
                  // bypass validation if there is a `previousOperation`, so that another equal click results in a repeat of the previous operation

                  if (previousOperation) {
                    const {
                      previousOperationMode,
                      previousOperationValue
                    } = previousOperation;

                    const { value: firstInt } = convert(first);

                    let resultInt;

                    if (previousOperationMode === OPERATIONS_KEYS.ADD) {
                      resultInt = firstInt + previousOperationValue;
                    } else if (
                      previousOperationMode === OPERATIONS_KEYS.SUBTRACT
                    ) {
                      resultInt = firstInt - previousOperationValue;
                    } else if (
                      previousOperationMode === OPERATIONS_KEYS.MULTIPLY
                    ) {
                      resultInt = firstInt * previousOperationValue;
                    } else if (
                      previousOperationMode === OPERATIONS_KEYS.DIVIDE
                    ) {
                      resultInt = firstInt / previousOperationValue;
                    }

                    const {
                      value: result,
                      isValid: isResultValid,
                      message: resultMessage
                    } = convert(resultInt);

                    if (!isResultValid) {
                      return alert(`${resultMessage}`);
                    }

                    setFirst(result);
                  }

                  let isThisEqualClickValid = true;

                  // check to see if valid: current `operationMode` is not equals but is something else AND two inputs received
                  if (
                    !operationMode ||
                    operationMode === OPERATIONS_KEYS.EQUALS
                  )
                    isThisEqualClickValid = false;

                  if (!first || !second) isThisEqualClickValid = false;

                  // we should not set `operationMode` to EQUALS if the equal click is not valid or output any result
                  if (!isThisEqualClickValid) return;

                  // if valid, calculate result and set it to first input, remove second input for subsequent calculation

                  const { value: firstInt } = convert(first);
                  const {
                    value: secondInt,
                    isValid: isSecondIntValid,
                    message: secondIntMessage
                  } = convert(second);

                  if (!isSecondIntValid) {
                    return alert(`${secondIntMessage}`);
                  }

                  let resultInt;

                  if (operationMode === OPERATIONS_KEYS.ADD) {
                    resultInt = firstInt + secondInt;
                  } else if (operationMode === OPERATIONS_KEYS.SUBTRACT) {
                    resultInt = firstInt - secondInt;
                  } else if (operationMode === OPERATIONS_KEYS.MULTIPLY) {
                    resultInt = firstInt * secondInt;
                  } else if (operationMode === OPERATIONS_KEYS.DIVIDE) {
                    resultInt = firstInt / secondInt;
                  }

                  const {
                    value: result,
                    isValid: isResultValid,
                    message: resultMessage
                  } = convert(resultInt);

                  if (!isResultValid) {
                    return alert(`${resultMessage}`);
                  }

                  setPreviousOperation({
                    previousOperationMode: operationMode,
                    previousOperationValue: secondInt
                  });

                  setFirst(result);
                  setSecond("");
                }

                return setOperationMode(opKey);
              }}
            >
              {OPERATIONS[opKey].symbol}
            </Button>
          ))}
        </OperationButtonsContainer>
      </RootButtonsContainer>
    </RootContainer>
  );
}

export default App;
