import { assertEquals, assertThrows } from "@std/assert";
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

Deno.test("Four queens puzzle", () => {
  const N = 4;
  const dlx = new AlgorithmX(N * 2 + ((N * 2 - 1) - 2) * 2, N * 2);
  dlx.addData("a1", [1, 5, 16]);
  dlx.addData("a2", [1, 6, 9, 15]);
  dlx.addData("a3", [1, 7, 10, 14]);
  dlx.addData("a4", [1, 8, 11]);
  dlx.addData("b1", [2, 5, 9, 17]);
  dlx.addData("b2", [2, 6, 10, 16]);
  dlx.addData("b3", [2, 7, 11, 15]);
  dlx.addData("b4", [2, 8, 12, 14]);
  dlx.addData("c1", [3, 5, 10, 18]);
  dlx.addData("c2", [3, 6, 11, 17]);
  dlx.addData("c3", [3, 7, 12, 16]);
  dlx.addData("c4", [3, 8, 13, 15]);
  dlx.addData("d1", [4, 5, 11]);
  dlx.addData("d2", [4, 6, 12, 18]);
  dlx.addData("d3", [4, 7, 13, 17]);
  dlx.addData("d4", [4, 8, 16]);
  const actual = dlx.solve().map((x) => x.toSorted());
  const expected: string[][] = [
    ["a2", "b4", "c1", "d3"],
    ["a3", "b1", "c4", "d2"],
  ];
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
