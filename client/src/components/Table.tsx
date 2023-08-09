import { forwardRef } from "react";
import { User } from "../App";

export const Table = forwardRef<
  HTMLTableRowElement,
  { data: User[] | undefined }
>(function ({ data }, ref) {
  return (
    <div className="scrollable-table-wrapper">
      <table>
        <thead>
          <tr>
            <td>#</td>
            <td>ID</td>
            <td>Full Name</td>
            <td>Address</td>
            <td>Telephone</td>
          </tr>
        </thead>
        {data ? (
          <tbody>
            {data.map((d, i) => {
              return (
                <tr key={i * 6}>
                  <td key={i * 6 + 1}>{i + 1}</td>
                  <td key={i * 6 + 2}>{d.id}</td>
                  <td key={i * 6 + 3}>{d.fullName}</td>
                  <td key={i * 6 + 4}>{d.address}</td>
                  <td key={i * 6 + 5}>{d.tel}</td>
                </tr>
              );
            })}
            <tr id="anchor" ref={ref}></tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td>MISSING DATA</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
});
