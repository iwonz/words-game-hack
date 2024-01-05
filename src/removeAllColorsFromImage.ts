import Jimp from 'jimp';
import sharp from 'sharp';

export function removeAllColors(inputImagePath, outputImagePath) {
  return new Promise((resolve) => {
    function cssColorToHex(cssColor) {
      return Jimp.cssColorToHex(cssColor);
    }

    function rgbToHsv(rgbColor) {
      const r = rgbColor.r / 255;
      const g = rgbColor.g / 255;
      const b = rgbColor.b / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;

      let h, s, v;

      if (delta === 0) {
        h = 0;
      } else if (max === r) {
        h = ((g - b) / delta) % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }

      h = Math.round(h * 60);
      if (h < 0) {
        h += 360;
      }

      s = max === 0 ? 0 : delta / max;
      v = max;

      return { h, s, v };
    }

    function isColorSimilarHSV(color1, color2) {
      const tolerance = 0.5;
      const deltaHue = Math.abs(color1.h - color2.h);
      const deltaSaturation = Math.abs(color1.s - color2.s);
      const deltaValue = Math.abs(color1.v - color2.v);

      const hueBoundary = 360;
      const adjustedDeltaHue = Math.min(deltaHue, hueBoundary - deltaHue);

      return (
        adjustedDeltaHue <= tolerance &&
        deltaSaturation <= tolerance &&
        deltaValue <= tolerance
      );
    }

    async function highlightColorAndShades(
      imagePath,
      outputImagePath,
      targetColorCSS,
    ) {
      const image = await Jimp.read(imagePath);

      const targetColorHex = cssColorToHex(targetColorCSS);

      image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        const pixelColorRGB = Jimp.intToRGBA(image.getPixelColor(x, y));
        const pixelColorHSV = rgbToHsv(pixelColorRGB);
        const targetColorHSV = rgbToHsv(Jimp.intToRGBA(targetColorHex));

        if (isColorSimilarHSV(pixelColorHSV, targetColorHSV)) {
          const brightnessFactor = 0.7;
          const newColor = Jimp.rgbaToInt(
            pixelColorRGB.r * brightnessFactor,
            pixelColorRGB.g * brightnessFactor,
            pixelColorRGB.b * brightnessFactor,
            pixelColorRGB.a,
          );

          image.setPixelColor(newColor, x, y);
        } else {
          image.setPixelColor(0xffffffff, x, y);
        }
      });

      await image.writeAsync(outputImagePath);
    }

    const targetColorCSS = '#4e4e4e';

    highlightColorAndShades(inputImagePath, outputImagePath, targetColorCSS)
      .then(() => {
        return sharp(outputImagePath).toBuffer();
      })
      .then(resolve)
      .catch((err) => console.error(err));
  });
}
