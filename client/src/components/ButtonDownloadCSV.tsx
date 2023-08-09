import React from "react";
import { User } from "../App";

type LocaleInputProps = {
  data: User[] | undefined;
};
export const ButtonDownloadCSV: React.FC<LocaleInputProps> = ({ data }) => {
  return (
    <>
      <input
        type="button"
        value="Download CSV"
        onClick={async () => {
          if (!data) return;
          const res = await fetch("/api/users/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!res.ok) throw Error(res.statusText);
          const blob = await res.blob();

          const filename = res.headers.get("Content-Disposition");
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename ?? "Users_Generated";
          document.body.appendChild(a);
          a.click();
          a.remove();
        }}
      />
    </>
  );
};
