# algorithm-x

This TypeScript library implements Knuth's Algorithm X and Dancing Links[^1].

> Note: It uses ECMAScript 2023 features.

## Basic usage

The following problem is taken from the Wikipedia page[^2].

- the universe _U_ = {1, 2, 3, 4, 5, 6, 7}
- the collection of set _S_ = {A, B, C, D, E, F}:
  - _A_ = {1, 4, 7}
  - _B_ = {1, 4}
  - _C_ = {4, 5, 7}
  - _D_ = {3, 5, 6}
  - _E_ = {2, 3, 6, 7}
  - _F_ = {2, 7}

```typescript
import { AlgorithmX } from "@kwj/algorithm-x";

const dlx = new AlgorithmX(7); // [1, 2, 3, 4, 5, 6, 7].length
dlx.addData("A", [1, 4, 7]);
dlx.addData("B", [1, 4]);
dlx.addData("C", [4, 5, 7]);
dlx.addData("D", [3, 5, 6]);
dlx.addData("E", [2, 3, 6, 7]);
dlx.addData("F", [2, 7]);
console.log(dlx.solve().map((x) => x.toSorted())); // [["B", "D", "F"]]
```

## Advanced usage

If you need not only covering exactly once but at most once, such as diagonal
lines in the eight queens puzzle, you have to divide constraints into two
groups.

Place constraint columns to be covered exactly once on the left side of the
matrix, and then create an `AlgorithmX` object which second parameter is the
number of these columns. For more information, see files in the `./example`
folder.

## License

MIT License

[^1]: [Dancing links](https://arxiv.org/abs/cs/0011047)

[^2]: [Knuth's Algorithm X](https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X)
