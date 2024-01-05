import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import multer from 'multer';
import { removeAllColors } from './removeAllColorsFromImage';
import { recognizeLetters } from './recognizeLetter';
import { openHtmlPage } from './openHtmlPage';
import { getDictionary } from './getDictionary';
import { findWords } from './findWords';

// Make dictionary
const dictionary = getDictionary();

// Start express app
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.post('/start', upload.single('file'), async (req, res) => {
  // @ts-expect-error
  const file = req.file;

  if (!file) {
    res.status(200).send('Не передан файл!');
  }

  try {
    const processPath = path.resolve(
      __dirname,
      '../processing/',
      String(Date.now()),
    );

    fs.mkdirSync(processPath);

    // Save source
    await sharp(file.buffer).toFile(path.resolve(processPath, `source.jpg`));

    // Crop source
    const croppedSource = sharp(file.buffer).extract({
      left: 91,
      top: 978,
      width: 1110,
      height: 1155,
    });
    const croppedSourcePath = path.resolve(processPath, `cropped.jpg`);
    await croppedSource.toFile(croppedSourcePath);

    // Cropped source color less
    const croppedSourceColorLess = sharp(
      await removeAllColors(
        croppedSourcePath,
        path.resolve(processPath, `cropped_colorless.jpg`),
      ),
    );

    // Crop and recognize letters
    const lettersGrid = await recognizeLetters(
      await croppedSourceColorLess.toBuffer(),
      processPath,
    );

    // Open html page
    const words = findWords(lettersGrid, dictionary);
    openHtmlPage(lettersGrid, words, processPath);

    res.status(200).send('Готово!');
  } catch (error) {
    console.log(error);

    res.status(200).send('Ошибка!');
  }
});

app.listen(3000, '0.0.0.0', () => {});
