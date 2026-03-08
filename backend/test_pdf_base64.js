const { chromium } = require('playwright');
const fs = require('fs');
async function test() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // create a dummy pdf
    fs.writeFileSync('test.pdf', '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n199\n%%EOF');
    
    const buf = fs.readFileSync('test.pdf');
    const b64 = buf.toString('base64');
    
    await page.goto('about:blank');
    await page.setContent(`<body style="margin:0;height:100vh;"><embed src="data:application/pdf;base64,${b64}" type="application/pdf" width="100%" height="100%"></body>`);
    
    console.log("PDF embedded!");
    await new Promise(r => setTimeout(r, 3000));
    await browser.close();
}
test();
