import React, { useRef } from "react";

type TyposInputsProps = {
  typos: number;
  setTypos: React.Dispatch<React.SetStateAction<number>>;
};
export const TyposInputs: React.FC<TyposInputsProps> = ({
  typos,
  setTypos,
}) => {
  const typosNumberRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <label htmlFor="typos-number">Typos: </label>
      <input
        type="number"
        name="typos-number"
        id="typos-number"
        step="0.25"
        min="0"
        max="1000"
        ref={typosNumberRef}
        value={typos}
        onChange={(e) => {
          e.preventDefault();
          const input = e.target.valueAsNumber;
          let newValue = Math.abs(Math.round(input * 4) / 4);
          if (Number.isNaN(newValue)) newValue = 0;
          if (newValue > 1000) newValue %= 1000;
          e.target.value = newValue.toString();
          setTypos(newValue);
        }}
        onKeyDown={(e) => {
          if (e.key == "Enter") e.currentTarget.blur();
        }}
      />
      <input
        type="range"
        name="typos-slider"
        id="typos-slider"
        min="0"
        max="10"
        step="0.25"
        value={typos}
        onChange={(e) => {
          const input = e.target.valueAsNumber;
          if (typosNumberRef.current !== null)
            typosNumberRef.current.value = input.toString();
          setTypos(input);
        }}
      />
    </>
  );
};
