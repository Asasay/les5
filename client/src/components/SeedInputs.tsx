import React, { useState } from "react";

type SeedInputsProps = {
  seed: number;
  setSeed: React.Dispatch<React.SetStateAction<number>>;
};
export const SeedInputs: React.FC<SeedInputsProps> = ({ seed, setSeed }) => {
  const [seedInput, setSeedInput] = useState(seed);
  return (
    <>
      <label htmlFor="seed">Seed: </label>
      <input
        type="number"
        name="seed"
        min="0"
        step="1"
        value={seedInput}
        onChange={(e) => setSeedInput(e.target.valueAsNumber)}
        onBlur={(e) => {
          let newValue = Math.abs(Math.round(seedInput));
          if (Number.isNaN(newValue)) newValue = 0;
          e.target.value = newValue.toString();
          setSeed(newValue);
        }}
        onKeyDown={(e) => {
          if (e.key == "Enter") e.currentTarget.blur();
        }}
      />{" "}
      <input
        type="button"
        value="Random"
        onClick={() => {
          const rand = Math.round(1000 * Math.random());
          setSeedInput(rand);
          setSeed(rand);
        }}
      />
    </>
  );
};
