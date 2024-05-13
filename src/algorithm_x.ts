/**
 * Data structure overview:
 *            :           :         :                  :
 *            |           |         |                  |
 *           u|          u|        u|                 u|
 *     +-----------r+ +------r+ +------r+ +-    -+ +------r+
 *  <--->'head_node'<->  '1'  <->  '2'  <-> .... <->  'n' <--->
 *     +-l----------+ +l------+ +l------+ +-    -+ +l------+
 *            |d          |d        |d                 |d
 *            |           |         |                  |
 *            |          u| r      u| r                |
 *  <------------------> node <--> node <----....------------->
 *            |         l |d      l |d                 |
 *            |           |         |                  |
 *            |           |        u| r               u| r
 *  <----------------------------> node <----....---> node <-->
 *            |           |       l |d               l |d
 *            |           |         |                  |
 *            :           :         :                  :
 *
 *               [c]olumn
 *                  |                 l : node
 *             [u]p :                 r : node
 *                | |                 u : node
 *    [l]eft <-- node --> [r]ight     d : node
 *                |                   c : node
 *              [d]own
 *
 *    #head ---->
 *              |
 *         +----.--------+--------+---------+--    -+---------+
 *         | 'head_node' |   '1'  |   '2'   | ..... |   'n'   |
 *         +-------------+--------+---------+--    -+---------+
 *      #cs      [0]         [1]      [2]               [n]
 *            head node  | <--        column nodes        --> |
 *
 *    #nCol = n
 */

/**
 * A class to represent a node for dancing links (DLX).
 *
 * head node:
 *   tag: head_node
 *   cnt: always 0 (don't be used)
 *   exactlyOnce: false
 *
 * column nodes:
 *   tag: string of column number (1, 2, 3, ...)
 *   exactlyOnce: true or false
 *
 * other nodes:
 *   tag: value specified by addData()
 *   cnt: always 0 (don't be used)
 *   exactlyOnce: false (don't be used)
 */
class Node {
  /** The tag name of the node. */
  tag: string;
  /** The number of nodes belonging to the column. (column nodes only) */
  cnt: number;
  /** The link to the left neighbor node. */
  l: Node;
  /** The link to the right neighbor node. */
  r: Node;
  /** The link to the up neighbor node. */
  u: Node;
  /** The link to the down neighbor node. */
  d: Node;
  /** The link to the column node of the relevant column. */
  c: Node;
  /** The flag indicates the constraint of column node must be covered exactly once. (only used on column nodes) */
  exactlyOnce: boolean;

  /** Create a new node. The initial value of links to nodes is itself. */
  // deno-fmt-ignore
  constructor() {
    this.tag = "";
    this.cnt = 0;
    this.l = this.r = this.u = this.d = this.c = this;
    this.exactlyOnce = false;
  }
}

/** Direction to follow the next node. */
enum Direction {
  Left,
  Right,
  Up,
  Down,
}

/**
 * A class to represent a solver of Algorithm X.
 */
export class AlgorithmX {
  /** The head node */
  #head: Node;
  /** The array which contains the head node and column nodes */
  #cs: Node[];
  /** The number of column nodes. */
  #nCol: number;
  /** The collection of tag name (key) and left-most node (value). */
  #tagMap: Map<string, Node>;
  /** The result of solver execution. */
  #answer: string[][];

  /**
   * Create a new solver. Prepare the head node and column nodes.
   *
   * @param cSize The number of columns.
   */
  constructor(cSize: number, nExactlyOnce: number = Number.MAX_SAFE_INTEGER) {
    if (cSize < 1) {
      throw new RangeError("The number of columns must be at least 1.");
    }
    nExactlyOnce = Math.min(nExactlyOnce, cSize);
    this.#cs = new Array(cSize + 1);
    this.#cs[0] = new Node();
    this.#cs[0].tag = "head_node";
    this.#cs[0].cnt = Number.MAX_SAFE_INTEGER; // sentinel
    for (let idx = 1; idx < cSize + 1; idx++) {
      this.#cs[idx] = new Node();
      this.#cs[idx].tag = String(idx);
      this.#cs[idx].l = this.#cs[idx - 1];
      this.#cs[idx].r = this.#cs[0];
      this.#cs[idx - 1].r = this.#cs[idx];
      if (idx <= nExactlyOnce) {
        this.#cs[idx].exactlyOnce = true;
      }
    }
    this.#cs[0].l = this.#cs[cSize];
    this.#head = this.#cs[0];
    this.#nCol = cSize;
    this.#tagMap = new Map<string, Node>();
    this.#answer = [];
  }

  /**
   * Add a constraint data (index format) to the solver.
   *
   * @param tag The name which uniquely identifies each row.
   * @param data A constraint data (index format).
   */
  addData(tag: string, data: number[]): void {
    const hookNode = (
      lst: number[],
      fst?: Node,
      prev?: Node,
    ): { head?: Node; tail?: Node } => {
      if (lst.length === 0) {
        return { head: fst, tail: prev };
      }
      const idx = lst[0];
      const cell = new Node();
      cell.tag = tag;
      cell.u = this.#cs[idx].u;
      cell.u.d = cell;
      cell.d = this.#cs[idx];
      cell.d.u = cell;
      cell.c = this.#cs[idx];
      this.#cs[idx].cnt += 1;
      if (prev === undefined) {
        return hookNode(lst.slice(1), cell, cell);
      } else {
        prev.r = cell;
        cell.l = prev;
        return hookNode(lst.slice(1), fst, cell);
      }
    };

    if (this.#tagMap.has(tag) === true) {
      throw new Error("The specified tag already exists.");
    }
    if (data.length < 1) {
      throw new Error("The row data must contain at least one element.");
    }
    const lst = Array.from(new Set(data))
      .toSorted((a: number, b: number) => a - b);
    if (lst[0] < 1 || lst.at(-1)! > this.#nCol) {
      throw new RangeError(`The index must be between 1 and ${this.#nCol}.`);
    }
    const { head, tail } = hookNode(lst, undefined, undefined);
    if (head !== undefined) {
      tail!.r = head!;
      head!.l = tail!;
      this.#tagMap.set(tag, head!);
    }
  }

  /**
   * Add a constraint data (row format) to the solver.
   *
   * @param tag The name which uniquely identifies each row.
   * @param row A constraint data (row format).
   */
  addRowData(tag: string, row: number[]): void {
    if (row.length !== this.#nCol) {
      throw new Error(
        `The size of row data is mismatch. It expects ${this.#nCol}, but got ${row.length}.`,
      );
    }

    const data: number[] = [];
    for (let i = 0; i < row.length; i += 1) {
      if (row[i] !== undefined && row[i] !== 0) {
        data.push(i + 1);
      }
    }
    this.addData(tag, data);
  }

  #follow(n: Node, fn: (a: Node) => void, dir: Direction): void {
    const _next = (n: Node): Node => {
      switch (dir) {
        case Direction.Left:
          return n.l;
        case Direction.Right:
          return n.r;
        case Direction.Up:
          return n.u;
        case Direction.Down:
          return n.d;
      }
    };

    const _loop = (n: Node): void => {
      if (n !== stop) {
        fn(n);
        _loop(_next(n));
      }
    };

    const stop = n;
    _loop(_next(n));
  }

  /**
   * Remove a constraint data.
   * Note: This function expects that circular reference objects should be removed by GC.
   *
   * @param tag The tag name indicating nodes to be removed.
   */
  delData(tag: string): void {
    const _delete = (n: Node): void => {
      n.u.d = n.d;
      n.d.u = n.u;
      n.c.cnt -= 1;
      n.u = n.d = n.c = n;
    };

    if (this.#tagMap.has(tag) === false) {
      // do nothing
      return;
    }

    const n = this.#tagMap.get(tag)!;
    _delete(n);
    this.#follow(n, _delete, Direction.Right);
    this.#tagMap.delete(tag);
  }

  #dlxCover(colNode: Node): void {
    const _cover = (n: Node): void => {
      n.u.d = n.d;
      n.d.u = n.u;
      n.c.cnt -= 1;
    };

    const _coverRow = (n: Node): void =>
      this.#follow(n, _cover, Direction.Right);

    colNode.r.l = colNode.l;
    colNode.l.r = colNode.r;
    this.#follow(colNode, _coverRow, Direction.Down);
  }

  #dlxUncover(colNode: Node): void {
    const _uncover = (n: Node): void => {
      n.u.d = n;
      n.d.u = n;
      n.c.cnt += 1;
    };

    const _uncoverRow = (n: Node): void =>
      this.#follow(n, _uncover, Direction.Left);

    this.#follow(colNode, _uncoverRow, Direction.Up);
    colNode.r.l = colNode;
    colNode.l.r = colNode;
  }

  /**
   * Run the solver.
   *
   * @returns The array of solutions.
   */
  solve(): string[][] {
    const _findMin = (n: Node, result: Node): Node => {
      if (n.exactlyOnce === false) {
        return result;
      }
      if (n.cnt < result.cnt) {
        return _findMin(n.r, n);
      } else {
        return _findMin(n.r, result);
      }
    };

    const _solve = (acc: string[]): void => {
      if (this.#head.r.exactlyOnce === false) {
        this.#answer.push(acc);
      } else {
        const colNode = _findMin(this.#head.r, this.#head.r);

        if (colNode.cnt > 0) {
          const _iter = (n: Node) => {
            this.#follow(n, (x) => this.#dlxCover(x.c), Direction.Right);
            _solve(acc.concat([n.tag]));
            this.#follow(n, (x) => this.#dlxUncover(x.c), Direction.Left);
          };

          this.#dlxCover(colNode);
          this.#follow(colNode, _iter, Direction.Down);
          this.#dlxUncover(colNode);
        }
      }
    };

    if (this.#answer.length !== 0) {
      this.#answer = [];
    }
    _solve([]);
    return this.#answer;
  }

  /**
   * Get the constraints matrix
   *
   * @returns The constraints matrix object
   */
  getConstraintsMatrix(): { tag: string; data: number[] }[] {
    const result: {
      tag: string;
      data: number[];
    }[] = [];
    const aux = (n: Node, tag: string, _m: Map<string, Node>): void => {
      const lst: number[] = Array(this.#nCol).fill(0);
      const _setIndex = (n: Node): void => {
        lst[Number(n.c.tag) - 1] = 1;
      };

      _setIndex(n);
      this.#follow(n, _setIndex, Direction.Right);
      result.push({ tag: tag, data: lst });
    };

    this.#tagMap.forEach(aux);
    return result;
  }
}
