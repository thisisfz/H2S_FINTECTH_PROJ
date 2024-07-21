import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { isNumberObject } from "util/types";

type NumInputType = {
  first: string;
  second: string;
  third: string;
  fourth: string;
};

type CardNumProps = {
  containerStyles?: string;
  handleCardNum: (val: string) => void;
  numInput: { first: string; second: string; third: string; fourth: string };
  setNumInput: Dispatch<SetStateAction<NumInputType>>;
};

const CardNum = ({
  containerStyles,
  handleCardNum,
  numInput,
  setNumInput,
}: CardNumProps) => {
  const handleNumInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if ( value && value != '0' && !Number(value) ) return;
    setNumInput((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    handleCardNum(
      numInput.first + numInput.second + numInput.third + numInput.fourth
    );
  }, [numInput]);

  useEffect(() => {
    const inputs = document.querySelectorAll(".card-num-input");
    const cardNums = Array.from(inputs) as Array<HTMLInputElement>;
    if (cardNums) {
      cardNums.forEach((input, index) => {
        input.onkeyup = (e: KeyboardEvent) => {
          const currEle = e.target as HTMLInputElement;
          const nextEle = input.nextElementSibling as HTMLInputElement;
          const prevEle = input.previousElementSibling as HTMLInputElement;
          if (prevEle && e.key == "Backspace") {
            if (currEle.value.length == 0) {
              prevEle.focus();
            }
          } else if (prevEle && prevEle.value.length != 4) {
            setNumInput((prev) => ({
              ...prev,
              [currEle.name]: "",
              [prevEle.name]: prevEle.value + currEle.value,
            }));
            prevEle.focus();
          } else {
            if (input.value.length == 4 && nextEle) {
              nextEle.focus();
            }
          }
        };
      });
    }
  });

  return (
    <div id="card-num-box" className={`card-num-box ${containerStyles}`}>
      <input
        type="text"
        className="card-num-input"
        maxLength={4}
        minLength={4}
        value={numInput.first}
        name="first"
        onChange={handleNumInput}
        autoFocus
        placeholder="Enter"
      />
      <input
        type="text"
        className="card-num-input"
        maxLength={4}
        minLength={4}
        value={numInput.second}
        name="second"
        onChange={handleNumInput}
        placeholder="Your"
      />
      <input
        type="text"
        className="card-num-input"
        maxLength={4}
        minLength={4}
        value={numInput.third}
        name="third"
        onChange={handleNumInput}
        placeholder="Card"
      />
      <input
        type="text"
        className="card-num-input"
        maxLength={4}
        minLength={4}
        value={numInput.fourth}
        name="fourth"
        onChange={handleNumInput}
        placeholder="Number"
      />
    </div>
  );
};

export default CardNum;
