import { assertEquals, assertThrows } from "jsr:@std/assert@^0.224.0";
import { AlgorithmX } from "./algorithm_x.ts";

// https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X#Example
Deno.test("Example from Wikipedia (index format)", () => {
  const dlx = new AlgorithmX(7);
  dlx.addData("A", [1, 4, 7]);
  dlx.addData("B", [1, 4]);
  dlx.addData("C", [4, 5, 7]);
  dlx.addData("D", [3, 5, 6]);
  dlx.addData("E", [2, 3, 6, 7]);
  dlx.addData("F", [2, 7]);
  const actual = dlx.solve().map((x) => x.toSorted());
  const expected: string[][] = [["B", "D", "F"]];
  assertEquals(actual, expected);
});

Deno.test("Example from Wikipedia (row format)", () => {
  const dlx = new AlgorithmX(7);
  dlx.addRowData("A", [1, 0, 0, 1, 0, 0, 1]);
  dlx.addRowData("B", [1, 0, 0, 1, 0, 0, 0]);
  dlx.addRowData("C", [0, 0, 0, 1, 1, 0, 1]);
  dlx.addRowData("D", [0, 0, 1, 0, 1, 1, 0]);
  dlx.addRowData("E", [0, 1, 1, 0, 0, 1, 1]);
  dlx.addRowData("F", [0, 1, 0, 0, 0, 0, 1]);
  const actual = dlx.solve().map((x) => x.toSorted());
  const expected: string[][] = [["B", "D", "F"]];
  assertEquals(actual, expected);
});

Deno.test("No solution (1)", () => {
  const dlx = new AlgorithmX(7);
  dlx.addData("A", [1, 4, 7]);
  dlx.addData("B", [1, 4]);
  dlx.addData("C", [4, 5, 7]);
  dlx.addData("D", [3, 5, 6]);
  dlx.addData("E", [2, 3, 6, 7]);
  const actual = dlx.solve().map((x) => x.toSorted());
  const expected: string[][] = [];
  assertEquals(actual, expected);
});

Deno.test("No solution (2)", () => {
  const dlx = new AlgorithmX(7);
  const actual = dlx.solve().map((x) => x.toSorted());
  const expected: string[][] = [];
  assertEquals(actual, expected);
});

Deno.test("Delete (1)", () => {
  const dlx = new AlgorithmX(7);
  dlx.addData("A", [1, 4, 7]);
  dlx.addData("B", [1, 4]);
  dlx.addData("C", [4, 5, 7]);
  dlx.addData("D", [3, 5, 6]);
  dlx.addData("E", [2, 3, 6, 7]);
  dlx.addData("F", [2, 7]);
  dlx.delData("B");
  dlx.addData("B", [2]);
  const actual = dlx.solve().map((x) => x.toSorted());
  const expected: string[][] = [["A", "B", "D"]];
  assertEquals(actual, expected);
});

Deno.test("Delete (2)", () => {
  const dlx = new AlgorithmX(7);
  dlx.addData("A", [1, 4, 7]);
  dlx.delData("B"); // if the data for the specified tag does not exist, nothing is done.
  dlx.addData("B", [1, 4]);
  dlx.addData("C", [4, 5, 7]);
  dlx.addData("D", [3, 5, 6]);
  dlx.addData("E", [2, 3, 6, 7]);
  dlx.addData("F", [2, 7]);
  const actual = dlx.solve().map((x) => x.toSorted());
  const expected: string[][] = [["B", "D", "F"]];
  assertEquals(actual, expected);
});

Deno.test("Assert throws (1)", () => {
  assertThrows(
    () => {
      const dlx = new AlgorithmX(0); // invalid number of columns
      dlx.addData("A", [1, 4, 7]);
    },
    RangeError,
    "The number of columns must be at least 1.",
  );
});

Deno.test("Assert throws (2)", () => {
  assertThrows(
    () => {
      const dlx = new AlgorithmX(7);
      dlx.addData("A", [1, 4, 7]);
      dlx.addData("B", []); // empty data
    },
    Error,
    "The row data must contain at least one element.",
  );
});

Deno.test("Assert throws (3)", () => {
  assertThrows(
    () => {
      const dlx = new AlgorithmX(7);
      dlx.addData("A", [1, 4, 8]); // invalid index
    },
    RangeError,
    "The index must be between 1 and 7.",
  );
});

Deno.test("Assert throws (4)", () => {
  assertThrows(
    () => {
      const dlx = new AlgorithmX(7);
      // the number of elements is more than the number of columns.
      dlx.addRowData("A", [1, 0, 0, 1, 0, 0, 1, 0]);
    },
    Error,
    "The size of row data is mismatch. It expects 7, but got 8.",
  );
});

Deno.test("Assert throws (5)", () => {
  assertThrows(
    () => {
      const dlx = new AlgorithmX(7);
      // the number of elements is less than the number of columns.
      dlx.addRowData("A", [1, 0, 0, 1, 0, 0]);
    },
    Error,
    "The size of row data is mismatch. It expects 7, but got 6.",
  );
});

Deno.test("Assert throws (6)", () => {
  assertThrows(
    () => {
      const dlx = new AlgorithmX(7);
      dlx.addData("A", [1, 4, 7]);
      dlx.addData("B", [1, 4]);
      dlx.addData("C", [4, 5, 7]);
      dlx.addData("B", [3, 5, 6]); // duplicated tag
    },
    Error,
    "The specified tag already exists.",
  );
});
