import React from "react";

type LocaleInputProps = {
  locale: string;
  setLocale: React.Dispatch<React.SetStateAction<string>>;
};
export const LocaleInput: React.FC<LocaleInputProps> = ({
  locale,
  setLocale,
}) => {
  return (
    <>
      <label htmlFor="locale">Locale: </label>
      <select
        name="locale"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
      >
        <option value="ru">Russia</option>
        <option value="uk">Ukraine</option>
        <option value="en">USA</option>
        <option value="pl">Poland</option>
        <option value="fr">France</option>
      </select>
    </>
  );
};
