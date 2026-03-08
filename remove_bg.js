const fs = require('fs');

async function removeBackground() {
  const Jimp = (await import('jimp')).default;
  const image = await Jimp.read('FrontWebsite/public/logo.png');
  
  // The background color seems to be roughly #FAF7F2
  // We'll calculate distance from this color and make it transparent
  const targetR = 250;
  const targetG = 247;
  const targetB = 242;
  const tolerance = 40;

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const red = this.bitmap.data[idx + 0];
    const green = this.bitmap.data[idx + 1];
    const blue = this.bitmap.data[idx + 2];
    
    // Check if color is close to background
    const distance = Math.sqrt(
      Math.pow(red - targetR, 2) + 
      Math.pow(green - targetG, 2) + 
      Math.pow(blue - targetB, 2)
    );
    
    if (distance < tolerance) {
      this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
    }
  });

  await image.writeAsync('FrontWebsite/public/logo_transparent.png');
  console.log("Background removed successfully!");
}

removeBackground().catch(console.error);
