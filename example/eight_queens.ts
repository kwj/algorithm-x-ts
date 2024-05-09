/**
 * Eight queens puzzle
 *
 *   8 ........
 *   7 ........   C#: Column (a, b, .., h)
 *   6 ........   R#: Row (1, 2, .., 8)
 *   5 ........
 *   4 ........
 *   3 ........
 *   2 ........
 *   1 ........
 *     abcdefgh
 *
 *  SE7    SE13
 *   6 \\\\\\\
 *   5 \\\\\\\\   SE#: Southeast direction (1, 2, .., 13)
 *   4 \\\\\\\\
 *   3 \\\\\\\\     \
 *   2 \\\\\\\\      \
 * SE1 \\\\\\\\       \
 *     \\\\\\\\
 *      \\\\\\\
 *
 *      ///////
 *     ////////   NE#: Northeast direction (1, 2, .., 13)
 *   1 ////////
 *   2 ////////       /
 *   3 ////////      /
 *   4 ////////     /
 *   5 ////////
 *   6 ///////
 *  NE7    NE13
 *
 * Column, Row (Ca, Cb, .., Ch, R1, R2, .., R8) - 16 constraints
 *   - One queen must be in the line.
 *   - It must be covered excatly once.
 * Diagonal (SE1, SE2, .., SE13, NE1, NE2, .., NE13) - 26 constraints
 *   - One or zero queen must be in the line.
 *   - It must only be covered at most once.
 *
 * [Matrix]
 *              exactly once <--- | ---> at most once
 * Tag  Ca Cb .. Ch | R1 R2 .. R8 | SE1 SE2 .. SE13 | NE1 NE2 .. NE6 NE7 NE8 .. NE13
 * -------------------------------+-----------------------------------------------------
 * a1    1  0 ..  0    1  0 ..  0 |  0   0  ..   0     0   0  ..  0   1   0  ..  0
 * a2    1  0 ..  0    0  1 ..  0 |  1   0  ..   0     0   0  ..  1   0   0  ..  0
 * ..
 * a8    1  0 ..  0    0  0 ..  1 |  0   0  ..   0     0   0  ..  0   0   0  ..  0
 * b1    0  1 ..  0    1  0 ..  0 |  1   0  ..   0     0   0  ..  0   0   1  ..  0
 * b2    0  1 ..  0    0  1 ..  0 |  0   1  ..   0     0   0  ..  0   1   0  ..  0
 * ..
 * h7    0  0 ..  1    0  0 ..  0 |  0   0  ..   1     0   0  ..  0   0   1  ..  0
 * h8    0  0 ..  1    0  0 ..  1 |  0   0  ..   0     0   0  ..  0   1   0  ..  0
 */

import { AlgorithmX } from "@kwj/algorithm-x";

const makeDlx = (N: number) => {
  const makeTag = (l: number, n: number) => {
    const ch = String.fromCharCode("a".charCodeAt(0) + l);
    return `${ch}${n + 1}`;
  };

  if (N < 1) {
    throw new RangeError("The board size must be a positive number.");
  }

  // If you wish to change the upper limit, please do so at your own risk.
  if (N > 13) {
    throw new RangeError("The board size is too large!");
  }

  const nDiagonalLines = (2 * N - 1) - (N === 1 ? 0 : 2);
  const dlx = new AlgorithmX(N * 2 + nDiagonalLines * 2, N * 2);
  for (let letter = 0; letter < N; letter += 1) {
    for (let num = 0; num < N; num += 1) {
      const idxLst: number[] = [letter + 1, (num + 1) + N];

      const se = letter + num;
      if (se !== 0 && se !== (N - 1) * 2) {
        idxLst.push(se + (N * 2));
      }

      const ne = (N - 1) + letter - num;
      if (ne !== 0 && ne !== (N - 1) * 2) {
        idxLst.push(ne + (N * 2) + (N - 1) * 2 - 1);
      }

      dlx.addData(makeTag(letter, num), idxLst);
    }
  }

  return dlx;
};

const dlx = makeDlx(8);
const result: string[][] = dlx.solve().map((x) => x.toSorted());

console.log(result);
console.log(result.length); // 92 when the board size is 8x8.
