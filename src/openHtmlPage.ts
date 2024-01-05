import * as path from 'path';
import * as fs from 'fs';
import { flatten } from 'lodash';
import { exec } from 'child_process';

export function openHtmlPage(lettersGrid, words, processRootPath) {
  const worldsList = Object.keys(words).sort((a, b) => b.length - a.length);
  const letters = flatten(lettersGrid);
  const paths = {
    html: path.resolve(processRootPath, 'index.html'),
    source: `file://${path.resolve(processRootPath, 'source.jpg')}`,
    cropped: `file://${path.resolve(processRootPath, 'cropped.jpg')}`,
    cropped_colorless: `file://${path.resolve(
      processRootPath,
      'cropped_colorless.jpg',
    )}`,
    letters: Array.from(Array(25)).map(
      (_, index) =>
        `file://${path.resolve(processRootPath, `./letters/${index + 1}.jpg`)}`,
    ),
  };
  const dataContent = letters.reduce((content, _, index) => {
    content += `
      <div class="item" data-index="${index}">
        <img class="item-image" src="${paths.letters[index]}">
        <div class="item-letter">${letters[index]}</div>
      </div>
    `;

    return content;
  }, '');
  const wordsContent = worldsList.reduce((content, word) => {
    content += `<span class="word" tabindex="1" data-word="${word}">${word}</span>`;

    return content;
  }, '');

  fs.writeFileSync(
    paths.html,
    `
      <!doctype html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Words Game Hack</title>
  
          <style>
             html,
             body {
              padding: 0;
              margin: 0;
             }
             
             body {
              background-color: #e2e2e2;
              padding: 20px;
             }
             
             .wrapper {
               display: flex;
               gap: 15px;
             }
          
              .data {
                display: inline-flex;
                flex-wrap: wrap;
                width: 560px;
                gap: 15px;
              }
  
              .item {
                width: 100px;
                height: 100px;
                border-radius: 5px;
                background: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 35px;
                font-weight: bold;
                position: relative;
              }
              
              .words {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 20px;
              }
  
              .word {
                display: inline-flex;
                padding: 3px 6px;
                border-radius: 10px;
                font-weight: bold;
                background-color: #fff;
                border: 1px solid transparent;
              }
              
              .word:focus {
                border-color: red;
              }
              
              .item[data-active="0"],
              .item[data-active="1"],
              .item[data-active="2"],
              .item[data-active="3"],
              .item[data-active="4"],
              .item[data-active="5"],
              .item[data-active="6"],
              .item[data-active="7"],
              .item[data-active="8"],
              .item[data-active="9"],
              .item[data-active="10"],
              .item[data-active="11"],
              .item[data-active="12"],
              .item[data-active="13"],
              .item[data-active="14"],
              .item[data-active="15"],
              .item[data-active="16"],
              .item[data-active="17"],
              .item[data-active="18"],
              .item[data-active="19"],
              .item[data-active="20"],
              .item[data-active="21"],
              .item[data-active="22"],
              .item[data-active="23"],
              .item[data-active="24"] {
                background-color: rgba(255, 0, 0, 1.0);
              }
              
              .item[data-active="0"]::after,
              .item[data-active="1"]::after,
              .item[data-active="2"]::after,
              .item[data-active="3"]::after,
              .item[data-active="4"]::after,
              .item[data-active="5"]::after,
              .item[data-active="6"]::after,
              .item[data-active="7"]::after,
              .item[data-active="8"]::after,
              .item[data-active="9"]::after,
              .item[data-active="10"]::after,
              .item[data-active="11"]::after,
              .item[data-active="12"]::after,
              .item[data-active="13"]::after,
              .item[data-active="14"]::after,
              .item[data-active="15"]::after,
              .item[data-active="16"]::after,
              .item[data-active="17"]::after,
              .item[data-active="18"]::after,
              .item[data-active="19"]::after,
              .item[data-active="20"]::after,
              .item[data-active="21"]::after,
              .item[data-active="22"]::after,
              .item[data-active="23"]::after,
              .item[data-active="24"]::after {
                content: attr(data-active);
                display: inline-flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                font-weight: bold;
                font-size: 13px;
                top: 10px;
                right: 10px;
                background-color: blue;
                border-radius: 50%;
                padding: 3px;
                color: #fff;
                width: 10px;
                height: 10px;
              }
              
              .item[data-active="1"] { background-color: rgba(255, 0, 0, 0.85); }
              .item[data-active="2"] { background-color: rgba(255, 0, 0, 0.7); }
              .item[data-active="3"] { background-color: rgba(255, 0, 0, 0.55); }
              .item[data-active="4"] { background-color: rgba(255, 0, 0, 0.40); }
              .item[data-active="5"] { background-color: rgba(255, 0, 0, 0.25); }
              .item[data-active="6"] { background-color: rgba(255, 0, 0, 0.10); }
              
              .item span {
                  font-size: 20px;
              }
              
              .item-image {
                  width: 50px;
                  height: 50px;
              }
              
              .source,
              .cropped,
              .cropped_colorless {
                  height: 400px;
              }
          </style>
      </head>
      <body>
          <div class="wrapper">
            <img class="source" src="${paths.source}" />
            <img class="cropped" src="${paths.cropped}" />
            <img class="cropped_colorless" src="${paths.cropped_colorless}" />
            <div class="data">${dataContent}</div>
          </div>
          <div class="words">${wordsContent}</div>
          <script>
            const words = ${JSON.stringify(words)};
            
            const clearItems = () => {
              const items = [...document.querySelectorAll('.item')];
              
              items.forEach((item) => {
                item.removeAttribute('data-active');
              });
            };
            
            document.addEventListener('focusout', () => {
              clearItems();
            });
            
            document.addEventListener('focusin', (event) => {
              clearItems();
              
              const items = [...document.querySelectorAll('.item')];
                            
              if (event.target && event.target.classList && event.target.classList.contains('word')) {
                const path = words[event.target.getAttribute('data-word')].path;
                
                path.forEach((index, position) => {
                  items[index].setAttribute('data-active', position);
                });
              }
            });
          </script>
      </body>
      </html>
    `,
  );

  exec(`open ${paths.html}`, () => {});
}
