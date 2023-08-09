import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User } from "../App";
import seedrandom from "seedrandom";

function insertChar(string: string, index: number, char: string) {
  return string.slice(0, index) + char + string.slice(index);
}

function removeChar(string: string, index: number) {
  return string.slice(0, index) + string.slice(index + 1);
}

function swapChar(string: string, index: number) {
  if (string.length <= 1) return string;
  return (
    string.substring(0, index) +
    string[index + 1] +
    string[index] +
    string.substring(index + 2)
  );
}
type Alpha = {
  [key: string]: string;
  ru: string;
  en: string;
  fr: string;
  pl: string;
  uk: string;
};
const alpha: Alpha = {
  ru: " АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЪЫЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя",
  en: " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  fr: " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀàÇçÉéÏïÔôÙùŸÿ",
  pl: " AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż",
  uk: " АаБбВвГгҐґДдЕеЄєЖжЗзИиІіЇїЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЬьЮюЯя",
};

export const useGenerateErrors = (
  data: User[] | undefined,
  seed: number,
  typos: number,
  locale: string
): [User[] | undefined, Dispatch<SetStateAction<User[] | undefined>>] => {
  const [alteredData, setAlteredData] = useState(data);

  useEffect(() => {
    const prng1 = seedrandom(seed.toString());
    if (data) {
      const newData = JSON.parse(JSON.stringify(data));
      newData.forEach((row: User) => {
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            let replacement;
            if (key == "id") replacement = "abcdef0123456789";
            else if (key == "tel") replacement = "+()0123456789";
            else if (key == "fullName") replacement = alpha[locale];
            else replacement = alpha[locale] + ".0123456789";
            row[key] = transfomString(row[key], replacement, prng1);
          }
        }
      });
      setAlteredData(newData);
    }
  }, [data, typos]);

  function transfomString(
    string: string,
    replacement: string,
    prng1: () => number
  ) {
    const newSeed = (seed ? seed : 228) * prng1();
    const prng2 = seedrandom(newSeed.toString());
    let result = string;
    if (string.length == 0) return result;
    const typosRand =
      typos - Math.floor(typos) > Math.random()
        ? Math.ceil(typos)
        : Math.floor(typos);

    for (let i = 0; i < typosRand; i++) {
      let pos;
      let randomChar;

      switch (Math.floor(prng2() * 3)) {
        case 0:
          pos = Math.floor(prng2() * (result.length + 1));
          randomChar = replacement[Math.floor(prng2() * replacement.length)];
          result = insertChar(result.toString(), pos, randomChar);
          break;
        case 1:
          pos = Math.floor(prng2() * result.length);
          result = removeChar(result.toString(), pos);
          break;
        default:
          pos = Math.floor(prng2() * (result.length - 1));
          result = swapChar(result.toString(), pos);
          break;
      }
    }

    return result;
  }

  return [alteredData, setAlteredData];
};
