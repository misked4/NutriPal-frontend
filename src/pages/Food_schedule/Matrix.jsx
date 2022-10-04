import React, { useState, useEffect } from 'react'

const n = 7;
const m = 6;
export const Matrix = () => {
  const [matrix, setMatrix] = useState(Array.from({length: n},()=> Array.from({length: m}, () => null)));

  const handleChange = (row, column, event) => {
    let copy = [...matrix];
    copy[row][column] = +event.target.value;
    setMatrix(copy);

    console.log(matrix);
  };

  return (
    <div className="sheet">
      <table>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((column, columnIndex) => (
                <td key={columnIndex}>
                  <input
                    type="number"
                    onChange={e => handleChange(rowIndex, columnIndex, e)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};