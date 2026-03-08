const fs = require('fs');

async function removeBackground() {
  const Jimp = (await import('jimp')).default;
  const image = await Jimp.read('FrontWebsite/public/logo.png');
  
  // The background color is a light cream: ~ #FCF9F2
  const targetR = 252;
  const targetG = 249;
  const targetB = 242;
  const tolerance = 60; // Increased tolerance

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
    
    // Also check for pure white or near-white which might be anti-aliasing artifacts
    const isNearWhite = red > 240 && green > 240 && blue > 240;
    
    if (distance < tolerance || isNearWhite) {
      this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
    }
  });

  await image.writeAsync('FrontWebsite/public/logo_transparent.png');
  console.log("Background removed successfully! Saved to logo_transparent.png");
}

removeBackground().catch(console.error);
