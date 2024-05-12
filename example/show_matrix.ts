/**
 * https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X#Example
 *
 * - the universe _U_ = {1, 2, 3, 4, 5, 6, 7}
 * - the collection of set _S_ = {A, B, C, D, E, F}:
 *   - _A_ = {1, 4, 7}
 *   - _B_ = {1, 4}
 *   - _C_ = {4, 5, 7}
 *   - _D_ = {3, 5, 6}
 *   - _E_ = {2, 3, 6, 7}
 *   - _F_ = {2, 7}
 */

import { AlgorithmX } from "@kwj/algorithm-x";

const dlx = new AlgorithmX(7);
dlx.addData("A", [1, 4, 7]);
dlx.addData("B", [1, 4]);
dlx.addData("C", [4, 5, 7]);
dlx.addData("D", [3, 5, 6]);
dlx.addData("E", [2, 3, 6, 7]);
dlx.addData("F", [2, 7]);

console.table(dlx.getConstraintsMatrix());
/**
 * $ deno run matrix.ts
 * ┌───────┬─────┬─────────────────────────┐
 * │ (idx) │ tag │ data                    │
 * ├───────┼─────┼─────────────────────────┤
 * │     0 │ "A" │ [ 1, 0, 0, 1, 0, 0, 1 ] │
 * │     1 │ "B" │ [ 1, 0, 0, 1, 0, 0, 0 ] │
 * │     2 │ "C" │ [ 0, 0, 0, 1, 1, 0, 1 ] │
 * │     3 │ "D" │ [ 0, 0, 1, 0, 1, 1, 0 ] │
 * │     4 │ "E" │ [ 0, 1, 1, 0, 0, 1, 1 ] │
 * │     5 │ "F" │ [ 0, 1, 0, 0, 0, 0, 1 ] │
 * └───────┴─────┴─────────────────────────┘
 */
