/**
 * Sudoku (Number place)
 *
 *   [Grid]
 *      C1 C2 C3 C4 C5 C6 C7 C8 C9
 *     +--------+--------+--------+    R: Row
 *   R1|        |        |        |    C: Column
 *   R2|   B1   |   B2   |   B3   |    B: Box
 *   R3|        |        |        |
 *     +--------+--------+--------+    Cell(x,y) = RxCy
 *   R4|        |        |        |      position = 9(x - 1) + (y - 1)
 *   R5|   B4   |   B5   |   B6   |
 *   R6|        |        |        |
 *     +--------+--------+--------+
 *   R7|        |        |        |
 *   R8|   B7   |   B8   |   B9   |
 *   R9|        |        |        |
 *     +--------+--------+--------+
 *
 *  [Matrix]
 *         R1C1 R1C2 .. R9C9 | R1#1 R1#2 .. R9#8 R9#9 | C1#1 C1#2 .. C9#8 C9#9 | B1#1 B1#2 .. B9#8 B9#9
 *  ----------------------------------------------------------------------------------------------------
 *  R1C1#1   1    0  ..   0      1    0  ..   0    0      1    0  ..   0    0      1    0  ..   0    0
 *  R1C1#2   1    0  ..   0      0    1  ..   0    0      0    1  ..   0    0      0    1  ..   0    0
 *   ...
 *  R1C1#9   1    0  ..   0      0    0  ..   0    0      0    0  ..   0    0      0    0  ..   0    0
 *  R1C2#1   0    1  ..   0      1    0  ..   0    0      0    0  ..   0    0      1    0  ..   0    0
 *   ...
 *  R1C9#9   0    0  ..   0      0    0  ..   0    0      0    0  ..   0    1      0    0  ..   0    0
 *  R2C1#1   0    0  ..   0      0    0  ..   0    0      1    0  ..   0    0      0    0  ..   0    0
 *   ...
 *  R9C9#8   0    0  ..   1      0    0  ..   1    0      0    0  ..   1    0      0    0  ..   1    0
 *  R9C9#9   0    0  ..   1      0    0  ..   0    1      0    0  ..   0    1      0    0  ..   0    1
 *
 *    Row: RxCy#N -> Cell(x,y) = N
 *    Col: RxCy -> some number is in Cell(x,y)       [cell constraint] (81 columns)
 *         Rx#N -> number 'N' is in the row Rx       [row constraint] (81 columns)
 *         Cy#N -> number 'N' is in the column Cy    [column constraint] (81 columns)
 *         Bz#N -> number 'N' is in the box Bz       [box constraint] (81 columns)
 */

import { AlgorithmX } from "@kwj/algorithm-x";

const makeDlx = (q: string): AlgorithmX => {
  /**
   * @param pos The position of the number (0-origin, 0..=80)
   * @param num The number (0, 1, ..., 9)
   */
  const addRow = (pos: number, num: number): void => {
    // r: row (0..=8), c: column (0..=8), b: box (0..=8)
    const [r, c, b]: number[] = [
      Math.floor(pos / 9),
      pos % 9,
      Math.floor(pos / 27) * 3 + Math.floor((pos % 9) / 3),
    ];

    const aux = (n: number) => {
      dlx.addData(
        `R${r + 1}C${c + 1}#${n}`,
        [pos + 1, 81 + r * 9 + n, (81 * 2) + c * 9 + n, (81 * 3) + b * 9 + n],
      );
    };

    if (num !== 0) {
      aux(num);
    } else {
      for (let i = 1; i <= 9; i++) {
        aux(i);
      }
    }
  };

  if (q.length !== 81 || q.search(/\D/) !== -1) {
    throw new Error("The board data is invalid.");
  }

  const dlx = new AlgorithmX(81 * 4);
  for (let i = 0; i < q.length; i++) {
    addRow(i, parseInt(q.at(i)!));
  }

  return dlx;
};

/**
 * [problem]
 *   8 . . | . . . | . . .
 *   . . 3 | 6 . . | . . .
 *   . 7 . | . 9 . | 2 . .
 *   ------+-------+------
 *   . 5 . | . . 7 | . . .
 *   . . . | . 4 5 | 7 . .
 *   . . . | 1 . . | . 3 .
 *   ------+-------+------
 *   . . 1 | . . . | . 6 8
 *   . . 8 | 5 . . | . 1 .
 *   . 9 . | . . . | 4 . .
 *
 *  [string format of the above problem]
 *    "800000000003600000070090200050007000000045700000100030001000068008500010090000400"
 */

const dlx = makeDlx(
  "800000000003600000070090200050007000000045700000100030001000068008500010090000400",
);
const result: string[][] = dlx.solve().map((x) => x.toSorted());

console.log(result);
/*
 * [
 *   [
 *     "R1C1#8", "R1C2#1", "R1C3#2", "R1C4#7", "R1C5#5",
 *     "R1C6#3", "R1C7#6", "R1C8#4", "R1C9#9", "R2C1#9",
 *     "R2C2#4", "R2C3#3", "R2C4#6", "R2C5#8", "R2C6#2",
 *     "R2C7#1", "R2C8#7", "R2C9#5", "R3C1#6", "R3C2#7",
 *     "R3C3#5", "R3C4#4", "R3C5#9", "R3C6#1", "R3C7#2",
 *     "R3C8#8", "R3C9#3", "R4C1#1", "R4C2#5", "R4C3#4",
 *     "R4C4#2", "R4C5#3", "R4C6#7", "R4C7#8", "R4C8#9",
 *     "R4C9#6", "R5C1#3", "R5C2#6", "R5C3#9", "R5C4#8",
 *     "R5C5#4", "R5C6#5", "R5C7#7", "R5C8#2", "R5C9#1",
 *     "R6C1#2", "R6C2#8", "R6C3#7", "R6C4#1", "R6C5#6",
 *     "R6C6#9", "R6C7#5", "R6C8#3", "R6C9#4", "R7C1#5",
 *     "R7C2#2", "R7C3#1", "R7C4#9", "R7C5#7", "R7C6#4",
 *     "R7C7#3", "R7C8#6", "R7C9#8", "R8C1#4", "R8C2#3",
 *     "R8C3#8", "R8C4#5", "R8C5#2", "R8C6#6", "R8C7#9",
 *     "R8C8#1", "R8C9#7", "R9C1#7", "R9C2#9", "R9C3#6",
 *     "R9C4#3", "R9C5#1", "R9C6#8", "R9C7#4", "R9C8#5",
 *     "R9C9#2"
 *   ]
 * ]
 */

/*
const ansStr = result[0].map((x) => x.at(-1)).join("");
for (let i = 0; i < 81; i += 9) {
  console.log(ansStr.slice(i, i + 9));
}

// 812753649
// 943682175
// 675491283
// 154237896
// 369845721
// 287169534
// 521974368
// 438526917
// 796318452
*/
