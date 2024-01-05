import * as Tesseract from 'tesseract.js';
import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

export async function recognizeLetter(imageBuffer) {
  return Tesseract.recognize(imageBuffer, 'rus')
    .then(({ data: { text } }) => text)
    .catch((error) => {
      console.error('Ошибка распознавания текста:', error.message);
    });
}

export async function recognizeLetters(imageBuffer, processPath) {
  fs.mkdirSync(path.resolve(processPath, 'letters'));

  return await Promise.all(
    Array(5)
      .fill(0)
      .reduce((acc, _, i) => {
        for (let j = 0; j < 5; j++) {
          const croppedLetter = sharp(imageBuffer)
            .extract({
              left: j * 210 + j * 15 + 20,
              top: i * 210 + i * 25 + 20,
              width: 210 - 20 * 2,
              height: 210 - 20 * 2,
            })
            .rotate(-5, { background: '#e2e2e2' });

          croppedLetter.toFile(
            path.resolve(processPath, `./letters/${i * 5 + (j + 1)}.jpg`),
          );

          acc.push(croppedLetter.toBuffer());
        }

        return acc;
      }, []),
  )
    .then((lines) => {
      return Promise.all(
        lines.map((line) => {
          return recognizeLetter(line);
        }),
      );
    })
    .then((textLines) => {
      const lines = [];
      let line = [];

      textLines.forEach((letter) => {
        // @ts-expect-error
        let l = letter.replace(/\s/gim, '').toUpperCase();
        if (l === 'Г]') {
          l = 'П';
        }
        if (l === '№') {
          l = 'М';
        }
        if (l === '-)') {
          l = 'Ы';
        }
        if (l === 'ЧО') {
          l = 'З';
        }
        if (l === '»)') {
          l = 'Ы';
        }
        if (l === 'ХХ') {
          l = 'Х';
        }
        if (l === '3') {
          l = 'З';
        }
        if (l === '|»)') {
          l = 'Ы';
        }
        if (l === '=') {
          l = 'Е';
        }

        line.push(l);

        if (line.length === 5) {
          lines.push(line);
          line = [];
        }
      });

      return lines;
    });
}
