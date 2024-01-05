class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (let char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }
}

function findWords(
  matrix: string[][],
  dictionary: string[],
): Record<string, { path: number[] }> {
  const output: Record<string, { path: number[] }> = {};
  const trie = new Trie();

  for (let word of dictionary) {
    trie.insert(word);
  }

  function searchWord(
    row: number,
    col: number,
    node: TrieNode,
    prefix: string,
    visited: boolean[][],
    path: number[],
  ) {
    if (node.isEndOfWord) {
      output[prefix] = { path: path.slice() };
      node.isEndOfWord = false; // to avoid duplicate words
    }

    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        if (dRow === 0 && dCol === 0) {
          continue; // Skip the current cell
        }
        const nextRow = row + dRow;
        const nextCol = col + dCol;
        if (
          nextRow >= 0 &&
          nextRow < 5 &&
          nextCol >= 0 &&
          nextCol < 5 &&
          !visited[nextRow][nextCol] &&
          node.children.has(matrix[nextRow][nextCol])
        ) {
          visited[nextRow][nextCol] = true;
          path.push(nextRow * 5 + nextCol); // Save the index of the letter
          searchWord(
            nextRow,
            nextCol,
            node.children.get(matrix[nextRow][nextCol])!,
            prefix + matrix[nextRow][nextCol],
            visited,
            path,
          );
          path.pop(); // Backtrack by removing the last index
          visited[nextRow][nextCol] = false;
        }
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const char = matrix[i][j];
      if (trie.root.children.has(char)) {
        const childNode = trie.root.children.get(char)!;
        const newVisited = Array.from({ length: 5 }, () =>
          Array(5).fill(false),
        );
        const newPath: number[] = [i * 5 + j]; // Start a new path from the current index
        newVisited[i][j] = true;
        searchWord(i, j, childNode, char, newVisited, newPath);
      }
    }
  }

  return output;
}

export { findWords };
