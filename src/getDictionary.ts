import * as iconv from 'iconv-lite';
import * as fs from 'fs';
import * as path from 'path';

export function getDictionary(wordMinLength = 4) {
  return [
    ...iconv
      .decode(fs.readFileSync(path.resolve(__dirname, './dictionaries/verbs.txt')), 'utf-8')
      .split('\n'),
    ...iconv
      .decode(fs.readFileSync(path.resolve(__dirname, './dictionaries/adject.txt')), 'utf-8')
      .split('\n'),
    ...iconv
      .decode(fs.readFileSync(path.resolve(__dirname, './dictionaries/nouns.txt')), 'utf-8')
      .split('\n'),
    ...iconv
      .decode(fs.readFileSync(path.resolve(__dirname, './dictionaries/words.txt')), 'utf-8')
      .split('\n'),
  ].reduce((dictionary, wordLine) => {
    const word = wordLine.trim().toUpperCase();

    if (word.length >= wordMinLength) {
      dictionary.push(word);
    }

    return dictionary;
  }, []);
}
