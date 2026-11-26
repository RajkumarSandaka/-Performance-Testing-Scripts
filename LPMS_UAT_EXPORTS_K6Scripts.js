import { browser } from 'k6/browser';
import encoding from 'k6/encoding';
import { check, sleep } from 'k6';
import http from "k6/http";
const pdfBase64 = encoding.b64encode(
    open("C:/k6-tests/file-example_PDF_1MB.pdf", "b")
);

function extractCaptcha(captchaImage) {
  if (!captchaImage || !captchaImage.includes(',')) {
    throw new Error('Invalid CAPTCHA image');
  }

  const base64 = captchaImage.split(',')[1];

  const svg = encoding.b64decode(base64, 'std', 's');

  const regex = /<text\b[^>]*>(.*?)<\/text>/gs;

  let captcha = '';
  let match;

  while ((match = regex.exec(svg)) !== null) {
    captcha += match[1];
  }

  if (!captcha) {
    throw new Error('No text found in SVG');
  }

  return captcha;
}

export const options = {
  scenarios: {
    ui: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 1,
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};
async function uploadPdf(page, selector, filename, base64Content) {

    await page.evaluate(
        (args) => {

            const selector = args.selector;
            const filename = args.filename;
            const base64 = args.base64;

            const input = document.querySelector(selector);

            if (!input) {
                throw new Error(
                    "File input not found: " + selector
                );
            }

            // Convert Base64 -> binary
            const binaryString = window.atob(base64);

            const bytes = new Uint8Array(
                binaryString.length
            );

            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Create actual PDF Blob
            const blob = new Blob(
                [bytes],
                {
                    type: "application/pdf"
                }
            );

            // Create actual browser File
            const file = new File(
                [blob],
                filename,
                {
                    type: "application/pdf",
                    lastModified: Date.now()
                }
            );

            // Create FileList
            const dataTransfer = new DataTransfer();

            dataTransfer.items.add(file);

            // Assign file to input
            input.files = dataTransfer.files;

            // Tell Angular that the file changed
            input.dispatchEvent(
                new Event("input", {
                    bubbles: true
                })
            );

            input.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );

        },
        {
            selector: selector,
            filename: filename,
            base64: base64Content
        }
    );

    console.log(
        "PDF assigned to browser file input"
    );
}

export default async function () {
 // const page = await browser.newPage();
const context = await browser.newContext();
await context.clearCookies();
    const page = await context.newPage();


 try {
    // Step 1: Open login page
    await page.goto('https://lpmsuat.kalelogistics.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    console.log('Login page opened');
await page.waitForTimeout(5000);

    // Step 2: Enter username and password
    await page.locator(
      '#txtEmailId'
    ).fill('lpaiadmin@yopmail.com');

    await page.locator(
      '#txtPasswordId'
    ).fill('KytSpai@2024');

    console.log('Credentials entered');
await page.waitForTimeout(5000);

  // Extract CAPTCHA image
const captchaImage = await page.locator(
      '[data-testid="shared-login-captcha-image"]'
    ).getAttribute('src');

    // Step 5: Extract CAPTCHA
    const captchaText = extractCaptcha(captchaImage);

    console.log('CAPTCHA extracted successfully');

    // Step 6: Automatically enter CAPTCHA
    await page.locator(
      '[data-testid="shared-login-captcha-input"]'
    ).fill(captchaText);

    // Step 7: Click Sign In
    await page.locator(
      '[data-testid="shared-login-btn-login-id"]'
    ).click();

    // Step 8: Wait for login processing
    await page.waitForTimeout(3000);

    // Step 9: Validate login
    const currentUrl = page.url();

    const loginSuccess = check(currentUrl, {
      'Login navigated away from login page': (url) =>
        !url.includes('/login'),
    });

    console.log(
      `Login navigation check: ${loginSuccess}`
    );

    await page.waitForTimeout(5000);

// Wait until LandingPage is loaded

for (let i = 0; i < 30; i++) {
    if (page.url().includes("LandingPage")) {
        console.log("Navigation completed");
        break;
    }

    await page.waitForTimeout(2000);
}

console.log(page.url());

await page.waitForTimeout(5000);


// Open Landport dropdown
/*await page.evaluate(() => {
    const toggle = document.querySelector('.igx-select__toggle-button');
    if (toggle) {
        toggle.click();
    }
});

await page.waitForTimeout(1000);

await page.evaluate(() => {
    const option = document.querySelector('igx-select-item[title="Agartala"]');
    if (option) {
        option.click();
    }
});

await page.waitForTimeout(5000);*/

  // Export Slot Booking

     await page.goto("https://lpmsuat.kalelogistics.com/LPMS/lpmsshipment");
    await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");

    // Create new Export Slot 
    await page.waitForSelector('#btnAddUldRow');

    await page.locator('#btnAddUldRow').click();
    await page.waitForTimeout(5000);

    // Slecet Vehicle Type
await page.evaluate(() => {
    const items = document.querySelectorAll('igx-combo-item');

    for (const item of items) {
        if (item.textContent.trim() === 'Truck') {
            item.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            }));
            break;
        }
    }
});
    await page.waitForTimeout(5000);
// CHA Agent 

const cha = page.locator('input[name="autoComplete"]').nth(0);

await cha.click();
await cha.fill("aa");

await page.waitForTimeout(3000);

// Navigate to first suggestion
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(500);

await page.keyboard.press("Enter");
await page.waitForTimeout(5000);

// Shipping Bill No / IGM No
const shippingBill = page.locator('input[formcontrolname="ShippingBillNoIGMNno"]');

await shippingBill.waitFor();
await shippingBill.click();

const randomShippingBill = Math.floor(10000000 + Math.random() * 90000000).toString();

await shippingBill.fill(randomShippingBill);

console.log(`Shipping Bill No / IGM No: ${randomShippingBill}`);

await page.waitForTimeout(5000);

// Select Today's Date
await page.evaluate(() => {
    const sb = document.querySelector('input[formcontrolname="ShippingBillNoIGMNno"]');
    const dateCell = sb.closest('igx-grid-cell').nextElementSibling;
    const icon = dateCell.querySelector('igx-icon[title="Choose Date"]');
    icon.click();
});

    // Click today's date
    const today = page.locator(
        "igx-day-item.igx-days-view__date--current"
    );

    await today.waitFor();
    await today.click();
await page.waitForTimeout(5000);

// Click the Exporter dropdown
const exporter = page.locator(
  'xpath=//input[@formcontrolname="HSNCode"]/ancestor::igx-grid-cell/preceding-sibling::igx-grid-cell[1]//input[@name="autoComplete"]'
);

await exporter.waitFor({ state: 'visible' });
await exporter.click();
await exporter.fill('ADITYA');
await page.waitForTimeout(5000);

//Enter HSN Code

const hsnCode = page.locator('input[formcontrolname="HSNCode"]');

await hsnCode.waitFor({ state: 'visible' });
await hsnCode.click();

// Generate a random 8-digit number
const randomHSN = Math.floor(10000000 + Math.random() * 90000000).toString();

console.log(`HSN Code: ${randomHSN}`);

await hsnCode.fill(randomHSN);
await page.waitForTimeout(5000);

//----------------------------------
// CargoCategory
//----------------------------------
const cargoCategory = page.locator(
'xpath=//input[@formcontrolname="HSNCode"]/ancestor::igx-grid-cell/following-sibling::igx-grid-cell[1]//input[@name="autoComplete"]'
);

await cargoCategory.waitFor({ state: 'visible' });
await cargoCategory.click();
await cargoCategory.fill('per');

await page.waitForTimeout(1500);
await cargoCategory.press('ArrowDown');
await cargoCategory.press('Enter');
await page.waitForTimeout(5000);

//----------------------------------
// Cargo Type
//----------------------------------
const cargoType = page.locator(
'xpath=//input[@formcontrolname="HSNCode"]/ancestor::igx-grid-cell/following-sibling::igx-grid-cell[2]//input[@name="autoComplete"]'
);

await cargoType.waitFor({ state: 'visible' });
await cargoType.click();
await cargoType.fill('HAZ');

await page.waitForTimeout(1000);

await cargoType.press('ArrowDown');
await cargoType.press('Enter');
await page.waitForTimeout(5000);

//----------------------------------
// Cargo Sub Category
const cargoSubCategory = page.locator(
'xpath=//input[@formcontrolname="HSNCode"]/ancestor::igx-grid-cell/following-sibling::igx-grid-cell[3]//input[@name="autoComplete"]'
);

await cargoSubCategory.waitFor({ state: 'visible' });
await cargoSubCategory.click();

// Type Cement
await cargoSubCategory.pressSequentially('Cement', { delay: 100 });

await page.waitForTimeout(2000);

// Select the first matching option
await cargoSubCategory.press('ArrowDown');
await page.waitForTimeout(300);
await cargoSubCategory.press('ArrowDown');
await page.waitForTimeout(300);
await cargoSubCategory.press('Enter');
await page.waitForTimeout(5000);

//----------------------------------
// Cargo Description
//----------------------------------
const cargoDesc = page.locator(
'xpath=//input[@formcontrolname="HSNCode"]/ancestor::igx-grid-cell/following-sibling::igx-grid-cell[4]//input'
);

await cargoDesc.waitFor({ state: 'visible' });
await cargoDesc.click();
await cargoDesc.fill('General');
await page.waitForTimeout(5000);

//----------------------------------
// Quantity
//----------------------------------
const quantity = page.locator(
'xpath=//input[@formcontrolname="HSNCode"]/ancestor::igx-grid-cell/following-sibling::igx-grid-cell[5]//input'
);

await quantity.waitFor({ state: 'visible' });
await quantity.click();
await quantity.fill('10');

await page.waitForTimeout(5000);

//----------------------------------
// Weight
//----------------------------------
const weight = page.locator(
'xpath=//input[@formcontrolname="HSNCode"]/ancestor::igx-grid-cell/following-sibling::igx-grid-cell[6]//input'
);

await weight.waitFor({ state: 'visible' });
await weight.click();
await weight.fill('100');

await page.waitForTimeout(5000);

//----------------------------------
// Cargo Value
//----------------------------------
const cargoValue = page.locator(
'xpath=//input[@formcontrolname="HSNCode"]/ancestor::igx-grid-cell/following-sibling::igx-grid-cell[7]//input'
);

await cargoValue.waitFor({ state: 'visible' });
await cargoValue.click();
await cargoValue.fill('10000');
await page.waitForTimeout(5000);

//----------------------------------
// Vehicle No
//----------------------------------
const vehicleNo = page.locator('input[formcontrolname="TruckNo"]');

await vehicleNo.waitFor({ state: 'visible' });
await vehicleNo.click();

const randomVehicleNo = 'AP' + Math.floor(10000 + Math.random() * 90000);

await vehicleNo.fill(randomVehicleNo);

console.log(`Vehicle No: ${randomVehicleNo}`);
await page.waitForLoadState("networkidle");

await page.waitForTimeout(5000);

//----------------------------------
// Upload Document
//---------------------------------
//----------------------------------

await page
     .locator('[role="gridcell"] > div:nth-of-type(2) > button')
     .click();

 await page
     .locator('[role="gridcell"] > div:nth-of-type(2) > button')
     .click();

///
// Open upload area

console.log("=== Starting PDF upload ===");

const fileSelector =
    '[data-testid="shared-common-document-upload-input-4"]';

// Wait for actual file input
await page.locator(fileSelector).waitFor({
    state: "attached",
    timeout: 30000
});

console.log("File input found");

// Inject real PDF File into browser
await uploadPdf(
    page,
    fileSelector,
    "file-example_PDF_1MB.pdf",
    pdfBase64
);

console.log("PDF selected successfully");

// Give Angular time to process FileList
await page.waitForTimeout(2000);

// Find Upload File button
const uploadButton = page.getByRole(
    "button",
    {
        name: "Upload File",
        exact: true
    }
);

await uploadButton.waitFor({
    state: "visible",
    timeout: 30000
});

console.log("Upload File button visible");

// Click application Upload File
await uploadButton.click();

console.log("Upload File clicked");

await page.waitForTimeout(3000);

console.log("=== PDF upload completed ===");
  
await page.waitForTimeout(5000);

/*await page.getByRole("button", {
    name: "Upload File",
    exact: true
}).click();

await page.waitForTimeout(5000);*/

//Upload Driving License Document

await page
    .locator('[role="gridcell"] > div:nth-of-type(3) > button')
    .click();

console.log('Clicked on Driving License upload button');
await page.waitForTimeout(3000);
// Open upload area
console.log("=== Starting PDF upload ===");

const fileSelectorli =
    '[data-testid="shared-common-document-upload-input-4"]';

// Wait for actual file input
await page.locator(fileSelectorli).waitFor({
    state: "attached",
    timeout: 30000
});

console.log("File input found");

// Inject real PDF File into browser
await uploadPdf(
    page,
    fileSelectorli,
    "file-example_PDF_1MB.pdf",
    pdfBase64
);

console.log("PDF selected successfully");

// Give Angular time to process FileList
await page.waitForTimeout(2000);

// Find Upload File button
const uploadButtonli = page.getByRole(
    "button",
    {
        name: "Upload File",
        exact: true
    }
);

await uploadButtonli.waitFor({
    state: "visible",
    timeout: 30000
});

console.log("Upload File button visible");

// Click application Upload File
await uploadButtonli.click();

console.log("Upload File clicked");

await page.waitForTimeout(3000);

console.log("=== PDF upload completed ===");
  
await page.waitForTimeout(5000);
///

//click on Select slot for booking

   await page
      .locator('[role="gridcell"] > div:nth-of-type(4) > button')
       .click();
await page.waitForTimeout(3000);

const todayb = new Date();

const day = String(todayb.getDate()).padStart(2, "0");
const month = String(todayb.getMonth() + 1).padStart(2, "0");
const year = todayb.getFullYear();

const todayDate = `${day}/${month}/${year}`;

const bookDialog = page.locator(
    'div.igx-dialog[aria-hidden="false"]'
);

const dateInput = bookDialog.locator(
    '#dtpfromdtId input[placeholder="dd/MM/yyyy"]'
);

await dateInput.fill(todayDate);

console.log("Selected date: " + todayDate);
await page.waitForTimeout(3000);

const slotsDropdown = page.locator(
    'dropdown[label="Slots"] igx-select'
);

await slotsDropdown.waitFor({
    state: "visible",
    timeout: 30000
});

await slotsDropdown.click();

console.log("Slots dropdown opened");
const option = page.locator('span.f-width').filter({
    hasText: '(06:00 - 18:00)-'
});
await option.waitFor({ state: 'visible', timeout: 10000 });
await option.click();


console.log("Slot  selected");

await page.waitForTimeout(3000);
await page.getByRole('button', {
    name: 'Book',
    exact: true
}).click();
await page.waitForTimeout(5000);
//----------------------------------
// Driving License No
//----------------------------------
const dlCell = page.locator(
    'igx-grid-cell:has(input[formcontrolname="DrivingLicenseNo"])'
).first();

await dlCell.click();

const drivingLicense = page.locator(
    'input[formcontrolname="DrivingLicenseNo"]'
).first();

await drivingLicense.waitFor({ state: 'visible' });
await drivingLicense.click();
await drivingLicense.fill('DL00910');
await page.waitForTimeout(5000);

//----------------------------------
// Driver DOB Calendar
//----------------------------------



const driverDOB = page.locator(
  'xpath=//input[@formcontrolname="DrivingLicenseNo"]/ancestor::igx-grid-cell/following-sibling::igx-grid-cell[1]//igx-date-picker'
);

// Find calendar icon
const calendarIcon = driverDOB.locator(
  'igx-icon[title="Choose Date"]'
);

console.log("Calendar icons found:", await calendarIcon.count());

// Click calendar icon
await calendarIcon.click({ timeout: 10000 });

await page.waitForTimeout(1000);

// Get today's date
const todaydob = new Date().getDate().toString();

// Select today's date



const driverDOB = page.locator(
  'xpath=//input[@formcontrolname="DrivingLicenseNo"]/ancestor::igx-grid-cell/following-sibling::igx-grid-cell[1]//igx-date-picker'
);

const calendarIcon = driverDOB.locator(
  'igx-icon[title="Choose Date"]'
);

console.log("Calendar icons found:", await calendarIcon.count());
console.log("Icon visible:", await calendarIcon.isVisible());

// Activate date picker grid cell
const dateCell = driverDOB.locator(
  'xpath=ancestor::igx-grid-cell[1]'
);

await dateCell.click({ timeout: 10000 });

await page.waitForTimeout(500);

// Open calendar using DOM click
await calendarIcon.evaluate((element) => {
  element.click();
});

console.log("Calendar icon clicked");

await page.waitForTimeout(500);

console.log("Today's date selected");


await page.waitForTimeout(5000);

//----------------------------------
// Driver Name
//----------------------------------
const driverName = page.locator(
'xpath=//input[@formcontrolname="DrivingLicenseNo"]/ancestor::igx-grid-cell/following-sibling::igx-grid-cell[2]//input'
);

await driverName.waitFor({ state: 'visible' });
await driverName.click();
await driverName.fill('Tester');
await page.waitForTimeout(5000);
//----------------------------------
// Driver Mobile No
//----------------------------------
const driverMobile = page.locator('input[formcontrolname="DriverContact"]');

await driverMobile.waitFor({ state: 'visible' });
await driverMobile.click();
await driverMobile.fill('9909002992');
await page.waitForTimeout(5000);

//----------------------------------
// Remarks / Chassis No
//----------------------------------
const remarks = page.locator('input[formcontrolname="RemarksChassisNo"]');

await remarks.waitFor({ state: 'visible' });
await remarks.click();
await remarks.fill('Test');
await page.waitForTimeout(5000);
//----------------------------------
// Save
//----------------------------------
const saveButton = page.locator(
    '.col-md-12.text-left button.new-btn-primary'
).filter({
    hasText: 'Save'
});

await saveButton.click();

await page.waitForTimeout(5000);
 // Export Gate In
     await page.goto("https://lpmsuat.kalelogistics.com/LPMS/lpmsgatein");
    await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");

//Search with Vehicle number in gatein

const vehicleFilter = page.locator(
    'igx-grid-header-group:nth-of-type(4) input'
);

await vehicleFilter.fill(randomVehicleNo);
  await page.waitForTimeout(5000);

await page.locator(
    '.align-items-center > button:nth-of-type(2)'
).click();
  await page.waitForTimeout(5000);

await page.getByRole('button', {
    name: 'Accept & Save',
    exact: true
}).click();
  await page.waitForTimeout(5000);

await page.getByRole('button', {
    name: 'Proceed',
    exact: true
}).click();
  await page.waitForTimeout(5000);

 // Export Weighment
     await page.goto("https://lpmsuat.kalelogistics.com/LPMS/lpmsweighment");
    await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");

const vehicleFilterwe = page.locator(
    'igx-grid-header-group:nth-of-type(3) input'
);
  await page.waitForTimeout(5000);

await vehicleFilterwe.fill(randomVehicleNo);

await page.locator(
    '.align-items-center > button:nth-of-type(2)'
).click();
  await page.waitForTimeout(3000);

await page.getByRole('textbox', {
    name: 'LWB Weight (Kgs)'
}).fill('100');
  await page.waitForTimeout(3000);

await page.getByRole('spinbutton', {
    name: 'No of Packages'
}).fill('10');
  await page.waitForTimeout(3000);

await page.getByRole('button', {
    name: 'Save',
    exact: true
}).click();
  await page.waitForTimeout(5000);

// Export Parking In
     await page.goto("https://lpmsuat.kalelogistics.com/LPMS/lpmsparkingin");
    await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");

const vehicleFilterin = page.locator(
    'igx-grid-header-group:nth-of-type(3) input'
);

await vehicleFilterin.fill(randomVehicleNo);
await page.waitForTimeout(5000);

await page.locator(
    '.align-items-center > button:nth-of-type(2)'
).click();
await page.waitForTimeout(3000);

await page.getByRole('button', {
    name: 'Save',
    exact: true
}).click();
await page.waitForTimeout(3000);

await page.getByRole('button', {
    name: 'No',
    exact: true
}).click();
await page.waitForTimeout(5000);

// Export Parking Out
     await page.goto("https://lpmsuat.kalelogistics.com/LPMS/lpmsparkingout");
    await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");

const vehicleFilterout = page.locator(
    'igx-grid-header-group:nth-of-type(3) input'
);

await vehicleFilterout.fill(randomVehicleNo);
await page.waitForTimeout(3000);

await page.locator(
    '.align-items-center > button:nth-of-type(2)'
).click();
await page.waitForTimeout(3000);
await page.getByRole('button', {
    name: 'Save',
    exact: true
}).click();
await page.waitForTimeout(3000);
await page.getByRole('button', {
    name: 'No',
    exact: true
}).click();
await page.waitForTimeout(5000);

// Export LEO Master
     await page.goto("https://lpmsuat.kalelogistics.com/LPMS/LEOMaster");
    await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");

const filter3 = page.locator(
    'igx-grid-header-group:nth-of-type(3) input'
);

await filter3.fill(randomShippingBill);
 await page.waitForTimeout(5000);

await page.locator(
    '.align-items-center > button:nth-of-type(2)'
).click();
 await page.waitForTimeout(5000);

const leoReceived = page.locator(
    'app-commondropdown[formcontrolname="LEOReceived"] igx-select'
).nth(1);
 await page.waitForTimeout(2000);


await leoReceived.locator('.igx-select__toggle-button').click();

await page.keyboard.press('ArrowDown');
await page.keyboard.press('Enter');
 await page.waitForTimeout(2000);

const inputField = page.locator(
    '.row > div:nth-of-type(2) > div > .igx-input-group input'
);

await inputField.fill('9898909');
 await page.waitForTimeout(3000);

const leoDateCalendar = page.locator(
    'app-dateformat[formcontrolname="LEODt"] igx-icon[name="today"][title="Choose Date"]'
).first();

await leoDateCalendar.click({ force: true });

 await page.waitForTimeout(3000);
// Click today's date
    const todayleo = page.locator(
        "igx-day-item.igx-days-view__date--current"
    );

    await todayleo.waitFor();
    await todayleo.click();

 await page.waitForTimeout(5000);
await page.getByRole('button', {
    name: 'Update',
    exact: true
}).click();
 await page.waitForTimeout(3000);

await page.getByRole('button', {
    name: 'No',
    exact: true
}).click();

 await page.waitForTimeout(5000);

// Export Invoice
     await page.goto("https://lpmsuat.kalelogistics.com/Billing/Invoice");
    await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");



await page.getByRole('button', {
    name: '+',
    exact: true
}).click();
  await page.waitForTimeout(3000);

const sbillLabel = page.locator(
    'label#igx-label-19'
);

await sbillLabel.click({ force: true });

await page.keyboard.type(randomShippingBill);
await page.waitForTimeout(500);

await page.locator(
    `span[title="${randomShippingBill}"]`
).click({ force: true });

  await page.waitForTimeout(5000);
await page.locator('label#igx-label-26').click({ force: true });

await page.keyboard.press('ArrowDown');
await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

await page.getByRole('button', {
    name: 'GET CHARGES',
    exact: true
}).click();
  await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");
await page.getByRole('button', {
    name: 'GENERATE TAX INVOICE',
    exact: true
}).click();
  await page.waitForTimeout(5000);
await page.getByRole('button', {
    name: 'Make Payment',
    exact: true
}).click();
  await page.waitForTimeout(3000);
await page.getByRole('button', {
    name: 'Confirm',
    exact: true
}).click();
  await page.waitForTimeout(3000);
await page.getByRole('button', {
    name: 'PRINT TAX INVOICE',
    exact: true
}).click();
  await page.waitForTimeout(5000);
await page.getByRole('button', {
    name: 'No',
    exact: true
}).click();
  await page.waitForTimeout(5000);

// Export Loaded Gatout
     await page.goto("https://lpmsuat.kalelogistics.com/LPMS/lpmsloadedgateout");
    await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");

const vehicleFilterlo = page.locator(
    'igx-grid-header-group:nth-of-type(3) input'
);

await vehicleFilterlo.fill(randomVehicleNo);
  await page.waitForTimeout(5000);
await page.locator(
    '.align-items-center > button:nth-of-type(2)'
).click();
 await page.waitForTimeout(5000);
await page.getByRole('button', {
    name: 'Save',
    exact: true
}).click();
  await page.waitForTimeout(5000);

// Export validategateout
     await page.goto("https://lpmsuat.kalelogistics.com/LPMS/validategateout");
    await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");

const vehicleFiltergo = page.locator(
    'igx-grid-header-group:nth-of-type(3) input'
);

await vehicleFiltergo.fill(randomVehicleNo);
 await page.waitForTimeout(5000);

await page.locator(
    '.align-items-center > button:nth-of-type(2)'
).click();
 await page.waitForTimeout(5000);

await page.getByRole('button', {
    name: 'Save',
    exact: true
}).click();
 await page.waitForTimeout(5000);

// Export exportemptyback
     await page.goto("https://lpmsuat.kalelogistics.com/LPMS/exportemptyback");
    await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");

const vehicleFiltereb = page.locator(
    'igx-grid-header-group:nth-of-type(3) input'
);

await vehicleFiltereb.fill(randomVehicleNo);
 await page.waitForTimeout(5000);
await page.locator(
    '.align-items-center > button:nth-of-type(2)'
).click();
 await page.waitForTimeout(5000);
await page.getByRole('button', {
    name: 'Return Empty',
    exact: true
}).click();
 await page.waitForTimeout(5000);
// Export exportemptygateout
     await page.goto("https://lpmsuat.kalelogistics.com/LPMS/exportemptygateout");
    await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle");
const vehicleFiltereeo = page.locator(
    'igx-grid-header-group:nth-of-type(3) input'
);

await vehicleFiltereeo.fill(randomVehicleNo);
 await page.waitForTimeout(5000);
await page.locator(
    '.align-items-center > button:nth-of-type(2)'
).click();
 await page.waitForTimeout(5000);
await page.getByRole('button', {
    name: 'Accept & Save',
    exact: true
}).click();
 await page.waitForTimeout(5000);

  } finally {
    await page.close();
  }
}
