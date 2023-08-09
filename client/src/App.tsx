import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import "./App.css";
import { Table } from "./components/Table";
import { useGenerateErrors } from "./hooks/useGenerateErrors";
import { LocaleInput } from "./components/LocaleInput";
import { SeedInputs } from "./components/SeedInputs";
import { TyposInputs } from "./components/TyposInputs";
import { ButtonDownloadCSV } from "./components/ButtonDownloadCSV";

export type User = {
  [key: string]: string;
  id: string;
  fullName: string;
  address: string;
  tel: string;
};

function App() {
  const [data, setData] = useState<User[]>([]);
  const [seed, setSeed] = useState(420);
  const [locale, setLocale] = useState("ru");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [typos, setTypos] = useState(0);

  const [alteredData] = useGenerateErrors(data, seed, typos, locale);
  const [bottomRef, inView] = useInView({
    threshold: 1,
  });

  function fetchData() {
    console.log("fetch initial");
    const abortController = new AbortController();
    fetch(
      `/api/users?seed=${seed}&locale=${locale}&page=${page}&count=${count}`,
      {
        signal: abortController.signal,
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        if (error == "AbortError") return;
      });
    return abortController;
  }

  function fetchMoreData() {
    console.log("fetch more");
    const abortController = new AbortController();
    fetch(`/api/users?seed=${seed}&locale=${locale}&page=${page + 1}&count=20`)
      .then((res) => res.json())
      .then((json) => {
        setCount((page + 1) * 20);
        setPage((page) => page + 1);
        setData((prev) => prev.concat(json));
      });

    return abortController;
  }

  useEffect(() => {
    const abortController = fetchData();
    return () => abortController.abort();
  }, [seed, locale]);

  useEffect(() => {
    if (inView) {
      const abortController = fetchMoreData();
      return () => abortController.abort();
    }
  }, [inView]);

  return (
    <>
      <div className="inputs-wrapper">
        <LocaleInput locale={locale} setLocale={setLocale} />
      </div>
      <div className="inputs-wrapper">
        <SeedInputs seed={seed} setSeed={setSeed} />
      </div>
      <div className="inputs-wrapper">
        <TyposInputs typos={typos} setTypos={setTypos} />
        <ButtonDownloadCSV data={alteredData} />
      </div>
      <Table data={alteredData} ref={bottomRef} />
      <p>Records loaded: {alteredData?.length}</p>
    </>
  );
}

export default App;
