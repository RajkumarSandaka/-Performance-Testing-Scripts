import { browser } from "k6/browser";
import encoding from "k6/encoding";
import http from "k6/http";
const pdfBase64 = encoding.b64encode(
    open("C:/k6-tests/file-example_PDF_1MB.pdf", "b")
);

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
    await page.goto("https://tst.budaccs.com/");
 	await page.waitForTimeout(3000);


    // Login
      await page.goto('https://tst.budaccs.com/');

    await page.locator('#txtEmailId').fill('KUHNEGELFFTRUCKER@YOPMAIL.COM');
    await page.locator('#txtPasswordId').fill('KUHNEGELfft@1');
    await page.waitForTimeout(10000);

    await page.locator('#btnLoginId').click();

    console.log('Login successful');

    await page.waitForTimeout(10000);


    // landing page
    await page.goto(
      'https://tst.budaccs.com/home/LandingPage'
    );

    await page.waitForTimeout(15000);
//await page.waitForLoadState("networkidle");

    // Export
     await page.goto("https://tst.budaccs.com/Export/CreateJob");
    await page.waitForTimeout(10000);

//await page.waitForLoadState("networkidle");

// Job Details -> Quick AWB
  // Click New Job
const newJobWrap = page.locator('.sh__new-job-wrap').last();

const newJobButton = newJobWrap.locator(
    '[data-testid="export-ui-master-floating-new-job-menu"]'
);

await newJobButton.waitFor({
    state: "visible",
    timeout: 30000,
});

await newJobButton.click();

const quickAWB = newJobWrap.locator(
    '[data-testid="export-ui-master-create-option-0"]'
);

await quickAWB.waitFor({
    state: "visible",
    timeout: 30000,
});

await quickAWB.click();
await page.waitForTimeout(3000);

//click on Add Shipper 

const shipper = page.locator('app-commonshipperautocomplete').first();

await shipper.locator('[data-testid="export-ui-common-shipper-autocomplete-add-shipper"]').click();
await page.waitForTimeout(3000);

//Enter Shipper Name

const randomNum = Math.floor(Math.random() * 100000);

const shipperName = `Shipper_pt_${randomNum}`;

const shipperInput = page.locator(
  '[data-testid="export-ui-customer-quick-upsert-input-3"]'
);

await shipperInput.click();
await shipperInput.fill(shipperName);
await page.waitForTimeout(3000);

//Shipper Address 1

const addressInput = page.locator(
  '[data-testid="export-ui-customer-quick-upsert-input-6"]'
);

await addressInput.click();
await addressInput.fill('123');
await page.waitForTimeout(3000);

//Shipper Address 2

await page.locator(
  '[data-testid="export-ui-customer-quick-upsert-input-7"]'
).click();

await page.locator(
  '[data-testid="export-ui-customer-quick-upsert-input-7"]'
).fill('123');

await page.waitForTimeout(3000);

//Enter Shipper Airport

const airportInput = page.locator(
  '[data-testid="export-ui-customer-quick-upsert-airport-input"]'
);

await airportInput.click();
await airportInput.fill('AAC');

await page.waitForTimeout(500);

await airportInput.press('ArrowDown');
await airportInput.press('Enter');

await page.waitForTimeout(3000);

//Save Shipper 

await page.locator(
  '[data-testid="export-ui-customer-quick-upsert-button-6"]'
).click();

await page.waitForTimeout(3000);

//Click Add Consignee


const consigneeSection = page.locator(
  'app-commonshipperautocomplete'
).nth(1);

await consigneeSection
  .locator('[data-testid="export-ui-common-shipper-autocomplete-add-consignee"]')
  .click();
await page.waitForTimeout(3000);
//Enter Consignee Name

const randomNumconsignee = Math.floor(Math.random() * 100000);

const consigneeName = `consignee_pt_${randomNumconsignee}`;

const consigneeInput = page.locator(
  '[data-testid="export-ui-customer-quick-upsert-input-3"]'
);

await consigneeInput.click();
await consigneeInput.fill(consigneeName);
await page.waitForTimeout(3000);

//Consignee Address 1

const addressInputConsignee = page.locator(
  '[data-testid="export-ui-customer-quick-upsert-input-6"]'
);

await addressInputConsignee.click();
await addressInputConsignee.fill('123');
await page.waitForTimeout(3000);

//Consignee Address 2

await page.locator(
  '[data-testid="export-ui-customer-quick-upsert-input-7"]'
).click();

await page.locator(
  '[data-testid="export-ui-customer-quick-upsert-input-7"]'
).fill('123');

await page.waitForTimeout(3000);

//Enter Consignee Airport

const airportInputConsignee = page.locator(
  '[data-testid="export-ui-customer-quick-upsert-airport-input"]'
);

await airportInputConsignee.click();
await airportInputConsignee.fill('AAC');

await page.waitForTimeout(500);

await airportInputConsignee.press('ArrowDown');
await airportInputConsignee.press('Enter');

await page.waitForTimeout(3000);

//Save Consignee 

await page.locator(
  '[data-testid="export-ui-customer-quick-upsert-button-6"]'
).click();

await page.waitForTimeout(3000);

//Enter Destination

const destinationAirport = page.locator(
  '[data-testid="export-ui-create-job-dropdown-13-input"]'
);

await destinationAirport.click();
await destinationAirport.fill('LVD');

await page.waitForTimeout(2000);
await destinationAirport.press('ArrowDown');
await destinationAirport.press('Enter');

//await page.getByText('LVD', { exact: true }).click();
await page.waitForTimeout(3000);

//Click on Dimentions
await page.locator(
  'div.slide-from-right-master.opened app-cargosummary [data-testid="export-ui-cargosummary-button-1"]'
).first().click();
await page.waitForTimeout(3000);

//Enter Pieces
const inputpieces = page.locator(
  '[data-testid="export-ui-cargodetails-input-17"]'
);

await inputpieces.click();
await inputpieces.fill('10');
await page.waitForTimeout(3000);

//Enter Length
const inputLength = page.locator(
  '[data-testid="export-ui-cargodetails-input-18"]'
);

await inputLength.click();
await inputLength.fill('10');
await page.waitForTimeout(3000);

//Enter Width
const inputWidth = page.locator(
  '[data-testid="export-ui-cargodetails-input-19"]'
);

await inputWidth.click();
await inputWidth.fill('10');
await page.waitForTimeout(3000);
//Enter Height
const inputHeight = page.locator(
  '[data-testid="export-ui-cargodetails-input-20"]'
);

await inputHeight.click();
await inputHeight.fill('10');
await page.waitForTimeout(3000);

//Save Dimentions

await page.locator(
  '[data-testid="export-ui-cargodetails-button-26"]'
).click();

await page.locator(
  '[data-testid="export-ui-cargodetails-button-26"]'
).click();
await page.waitForTimeout(3000);

//Enter  Gross Weight
const grossWeights = page.locator(
  'input#GrossWeight[data-testid="export-ui-cargosummary-input-6"]'
);

for (let i = 0; i < await grossWeights.count(); i++) {
  if (await grossWeights.nth(i).isVisible()) {
    await grossWeights.nth(i).fill('100');
    break;
  }
}
await page.waitForTimeout(3000);

//Select SHC

// 1. Click SHC dropdown using its toggle button
const shcToggles = page.locator(
  '[data-testid="export-ui-cargosummary-dropdown-15"] .igx-combo__toggle-button'
);

const shcCount = await shcToggles.count();

for (let i = 0; i < shcCount; i++) {
  const toggle = shcToggles.nth(i);

  if (await toggle.isVisible()) {
    await toggle.click();
    break;
  }
}

await page.waitForTimeout(500);


// 2. Find visible search box and enter GEN
const searchBoxes = page.locator(
  'input[name="searchInput"][role="searchbox"]'
);

const searchCount = await searchBoxes.count();

for (let i = 0; i < searchCount; i++) {
  const searchBox = searchBoxes.nth(i);

  if (await searchBox.isVisible()) {
    await searchBox.click();
    await searchBox.fill('GEN');
    break;
  }
}

await page.waitForTimeout(1000);


// 3. Select GEN option
const optionsshc = page.locator('igx-combo-item');

const optionCountshc = await optionsshc.count();

for (let i = 0; i < optionCountshc; i++) {
  const optionshc = optionsshc.nth(i);

  if (await optionshc.isVisible()) {
    const optionText = await optionshc.textContent();

    await page.locator('span.name[title="GEN - General Cargo"]').click(); {
      
      break;
    }
  }
}
await page.waitForTimeout(3000);

//Commodity

const dropdown16Inputs = page.locator(
  '[data-testid="export-ui-cargosummary-dropdown-16-input"]'
);

const dropdown16Count = await dropdown16Inputs.count();

for (let i = 0; i < dropdown16Count; i++) {
  const input = dropdown16Inputs.nth(i);

  if (await input.isVisible()) {
    await input.click();
    await input.fill('General');

    await page.waitForTimeout(2000);
await input.press('ArrowDown');
    await input.press('Enter');

  }
}
await page.waitForTimeout(3000);
//Enter Nature of Goods
const natureInputs = page.locator(
  '[data-testid="export-ui-cargosummary-input-group-7"] input[name="CargoDescription"]'
);

const natureCount = await natureInputs.count();

let natureFilled = false;

for (let i = 0; i < natureCount; i++) {
  const input = natureInputs.nth(i);

  if (await input.isVisible()) {
    await input.click();
    await input.fill('General');
    natureFilled = true;
    break;
  }
}

if (!natureFilled) {
  console.log('No visible Nature of Goods input found');
}
await page.waitForTimeout(3000);

//Save Job

await page.locator(
  '[data-testid="export-ui-create-job-submit"]'
).click();

await page.waitForTimeout(3000);

   
    // Export
await page.goto("https://tst.budaccs.com/Export/CreateJob");
    await page.waitForTimeout(3000);
await page.waitForLoadState("networkidle");



// Search textbox
const searchBox = page.locator(
  '[data-testid="export-ui-master-page-search-job-dropdown-1-input"]'
);

await searchBox.waitFor({ state: "visible" });

// Clear existing value
await searchBox.fill("");

await page.waitForTimeout(500);

// Type shippername
await searchBox.type(shipperName, { delay: 100 });
//shipperName
// Wait for dropdown to load
await page.waitForTimeout(3000);

// Select first matching option
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(1000);
await page.keyboard.press("Enter");

console.log("shipperName selected");

await page.waitForTimeout(3000);

//Select the search Job

const truckingCheckbox = page.locator(
  '[data-testid="export-ui-job-list-igx-checkbox-8"]'
);

await truckingCheckbox.click();
await page.waitForTimeout(3000);


//Assign to trucking company 

const truckingLinks = page.locator('a.new-btn-link-2');

const truckingCount = await truckingLinks.count();

for (let i = 0; i < truckingCount; i++) {
  const link = truckingLinks.nth(i);

  if (await link.isVisible()) {
    const text = await link.textContent();

    if (text && text.trim() === 'Assign Trucking Company') {
      await link.click();
      console.log('Assign Trucking Company clicked');
      break;
    }
  }
}
await page.waitForTimeout(3000);

//Save Assign Trucking Company

const saveButtontruck = page.locator(
  '[data-testid="export-ui-job-list-button-32"]'
);

await saveButtontruck.click();

console.log('Save button clicked');
await page.waitForTimeout(3000);


// click edit 
const editButton = page.locator(
  '[data-testid="export-ui-job-list-button-5"]'
);

await editButton.waitFor({ state: "visible" });
await editButton.click();

console.log("Edit button clicked");
await page.waitForTimeout(3000);

// Click "Pending For Action - Rates" tab
const ratesTab = page.locator(
  '[data-testid="export-ui-master-page-button-65"]'
);

await ratesTab.waitFor({ state: "visible" });
await ratesTab.click();

console.log("Pending For Action - Rates tab clicked");

await page.waitForTimeout(3000);

// Click Manual Rates button
const manualRatesBtn = page.locator(
  '[data-testid="export-ui-rates-button-25"]'
);

await manualRatesBtn.waitFor({ state: "visible" });
await manualRatesBtn.click();

console.log("Manual Rates button clicked");

await page.waitForTimeout(3000);

//Select Airline

// Find all labels
const labels = page.locator('label');

const labelCount = await labels.count();

for (let i = 0; i < labelCount; i++) {

    const label = labels.nth(i);

    if (await label.isVisible()) {

        const labelText = await label.textContent();

        if (labelText && labelText.trim().includes('Airline')) {

            console.log('Airline label found');

            // Get the igx-input-group containing the Airline label
            const airlineGroup = label.locator(
                'xpath=ancestor::igx-input-group[1]'
            );

            const airlineInput = airlineGroup.locator(
                'input[role="combobox"]'
            );

            // Click Airline dropdown
            await airlineInput.click();

            console.log('Airline dropdown opened');

            await page.waitForTimeout(500);

            // Get all dropdown options
            const optionsairs = page.locator('igx-select-item');

            const optionCount = await optionsairs.count();

            for (let j = 0; j < optionCount; j++) {

                const option = optionsairs.nth(j);

                if (await option.isVisible()) {

                    const text = await option.textContent();

                    // Select TK
                    if (text && text.trim().includes('TK')) {

                        await option.click();

                        console.log(
                            `Airline selected: ${text.trim()}`
                        );

                        break;
                    }
                }
            }

            // Stop after handling Airline
            break;
        }
    }
}
    
await page.waitForTimeout(3000);
// Click the autocomplete input
const chargeInput = page.locator(
  '[data-testid="export-ui-rates-commonautocomplete-1-input"]'
);

await chargeInput.waitFor({ state: "visible" });
await chargeInput.click();

await page.waitForTimeout(2000);

// Select the 2nd option from the dropdown
const secondOption = page.locator("igx-drop-down-item").nth(1);

await secondOption.waitFor({ state: "visible" });
await secondOption.click();

console.log("Second dropdown option selected");

await page.waitForTimeout(3000);


// Open dropdown
const rateDropdown = page.locator(
    '[data-testid="export-ui-rates-commondropdown-6-select"]'
);

console.log("Dropdowns: " + await rateDropdown.count());

// Click the visible dropdown
await rateDropdown.nth(1).click();

await page.waitForTimeout(1000);

// Get all matching options
const rateOptions = page.locator(
    '[data-testid="export-ui-rates-commondropdown-6-option-5"]'
);

const optionCount = await rateOptions.count();

console.log("Options found: " + optionCount);

// Click the last option (usually the visible one)
await rateOptions.nth(optionCount - 1).click();
await page.waitForTimeout(3000);

// Rate input
const rateInput = page.locator(
  '[data-testid="export-ui-rates-input-71"]'
);

await rateInput.waitFor({ state: "visible" });
await rateInput.click();

await page.waitForTimeout(3000);

// Clear existing value
await rateInput.fill("");

// Enter rate
await rateInput.type("10", { delay: 100 });

console.log("Rate entered: 10");

await page.waitForTimeout(3000);

// Click Rate Save button
const saveBtn = page.locator(
  '[data-testid="export-ui-rates-button-81"]'
);

await saveBtn.waitFor({ state: "visible" });
await saveBtn.click();

console.log("Save button clicked");

await page.waitForTimeout(3000);


/*// Click Rates dropdown
const accordionButton = page.locator(
    '[data-testid="export-ui-rates-button-29"]'
);

await accordionButton.waitFor();

await accordionButton.click();
await page.waitForTimeout(3000);

// Wait for button
await page.waitForSelector('[data-testid="export-ui-rates-button-32"]');

// Click "+ Ad hoc Rate"
await page.locator('[data-testid="export-ui-rates-button-32"]').click();

console.log("Clicked + Ad hoc Rate");

await page.waitForTimeout(3000);

// Freight Rate input
const freightRate = page.locator(
    '[data-testid="export-ui-rates-input-33"]'
);

await freightRate.waitFor();
await freightRate.click({ force: true });
await freightRate.fill("10");

await page.waitForTimeout(1000);

// SEND button
const sendButton = page.locator(
    '[data-testid="export-ui-rates-button-36"]'
);

await sendButton.waitFor();
await sendButton.click();

console.log("Clicked SEND button");

await page.waitForTimeout(3000);*/


//Click on Assign AWB

const assignAwbButton = page.locator(
  '[data-testid="export-ui-master-page-button-29"]'
);

await assignAwbButton.click();

console.log('ASSIGN AWB clicked');
await page.waitForTimeout(3000);

//Select Airline to Assign AWB

const airlineSelect = page.locator(
  '[data-testid="export-ui-master-page-commondropdown-1-airline-select"]'
);

const airlineInput = airlineSelect.locator(
  'input[role="combobox"]'
);

// Open Airline dropdown
await airlineInput.click();

await page.waitForTimeout(1000);

// Find all visible options
const optionsassign = page.locator(
  'igx-select-item'
);

const optionCountair = await optionsassign.count();

for (let i = 0; i < optionCountair; i++) {
  const option = optionsassign.nth(i);

  if (await option.isVisible()) {
    const text = await option.textContent();

    if (text && text.trim().includes('TK')) {
      await option.click();
      console.log(`Airline selected: ${text.trim()}`);
      break;
    }
  }
}
await page.waitForTimeout(3000);

//Enter AWB number

// Generate a random 7-digit number
const randomNumberawb = Math.floor(
  1000000 + Math.random() * 9000000
);

// Calculate modulus with 7
const modNumber = randomNumberawb % 7;

// Concatenate number + modulus
const awbNumber = `${randomNumberawb}${modNumber}`;

console.log(`Generated AWB Number: ${awbNumber}`);

// Enter into AWB field
const awbInput = page.locator(
  '[data-testid="export-ui-master-page-input-50"]'
);

await awbInput.click();
await awbInput.fill(awbNumber);

await page.waitForTimeout(3000);

//Save Assign AWb
const assignButton = page.locator(
  '[data-testid="export-ui-master-page-button-51"]'
);

await assignButton.click();

console.log('ASSIGN button clicked');
await page.waitForTimeout(3000);

//Navigate to Job details Tab

const jobDetailsTab = page.locator(
  '[data-testid="export-ui-master-page-button-64"]'
);

await jobDetailsTab.click();

console.log('Job Details tab clicked successfully');

await page.waitForTimeout(3000);

//Enter MRN details

const mrnInputs = page.locator(
  '[data-testid="export-ui-mrndetails-input-10"]'
);

const countmrn = await mrnInputs.count();

console.log(`MRN input count: ${countmrn}`);

for (let i = 0; i < countmrn; i++) {
  const mrnInput = mrnInputs.nth(i);

  if (await mrnInput.isVisible()) {
    console.log(`Visible MRN input found at index: ${i}`);

    await mrnInput.waitFor({
      state: "visible",
      timeout: 30000
    });

    await mrnInput.click();
    await mrnInput.fill('199288293829282222');

    console.log('MRN Number entered successfully');
    break;
  }
}
await page.waitForTimeout(3000);

//Enter Pieces in MRN
const piecesInput = page.locator(
  '[data-testid="export-ui-mrndetails-input-11"]'
);

await piecesInput.click();
await piecesInput.fill('10');

console.log('Pieces entered successfully');
await page.waitForTimeout(3000);

//Enter Weight in MRN

const grossWeightInput = page.locator(
  '[data-testid="export-ui-mrndetails-input-12"]'
);

await grossWeightInput.click();
await grossWeightInput.fill('100');

console.log('Gross Weight entered successfully');

await page.waitForTimeout(3000);

//Select SCI

// Find all dropdown components
const dropdowns = page.locator('dropdown');

const count = await dropdowns.count();

for (let i = 0; i < count; i++) {

    const dropdown = dropdowns.nth(i);

    if (!(await dropdown.isVisible())) {
        continue;
    }

    const text = await dropdown.textContent();

    // Find the dropdown containing SCI*
    if (text && text.includes('SCI')) {

        console.log('SCI dropdown found at index:', i);

        // Click the SCI dropdown toggle arrow
        const sciToggle = dropdown.locator(
            'igx-suffix.igx-select__toggle-button'
        );

        await sciToggle.click();

        console.log('SCI clicked successfully');

        break;
    }
}
await page.waitForTimeout(500);


// Select T1 from visible options
const options = page.locator(
    'igx-select-item[title="T1"]'
);

const optionCountT1 = await options.count();

let selected = false;

for (let i = 0; i < optionCountT1; i++) {

    const option = options.nth(i);

    if (await option.isVisible()) {

        await option.click();

        console.log('SCI T1 selected successfully');

        selected = true;
        break;
    }
}

if (!selected) {
    console.log('Could not select SCI T1');
}
await page.waitForTimeout(3000);

//Navigate to Documents Tab

const documentsTab = page.locator(
  '[data-testid="export-ui-master-page-button-70"]'
);

await documentsTab.click();

console.log('Documents tab clicked successfully');

await page.waitForTimeout(3000);

//Upload Document

console.log("=== Starting PDF upload ===");

const fileSelector =
    '[data-testid="export-ui-common-document-upload-input-11"]';

const fileInput = page.locator(fileSelector);

// Wait until the actual file input is available
await fileInput.waitFor({
    state: "attached",
    timeout: 30000
});

console.log("File input found");

// Upload PDF
await uploadPdf(
    page,
    fileSelector,
    "file-example_PDF_1MB.pdf",
    pdfBase64
);

console.log("PDF selected successfully");

// Wait for Angular application processing
await page.waitForTimeout(3000);

console.log("=== PDF upload completed ===");

await page.waitForTimeout(3000);


//Save Job again

const saveButtonagain = page.locator(
  '[data-testid="export-ui-master-page-button-109"]'
);

await saveButtonagain.click();

console.log('Save button clicked successfully');

await page.waitForTimeout(3000);



//Navigate to Flight details

const flightsTab = page.locator(
  '[data-testid="export-ui-master-page-button-66"]'
);

await flightsTab.waitFor({
  state: "visible",
  timeout: 30000
});

await flightsTab.click();

console.log('Flights tab clicked successfully');

await page.waitForTimeout(3000);

//Click on Manual Flight Booking

const manualBookingButton = page.locator(
  '[data-testid="export-ui-flights-button-1"]'
);

await manualBookingButton.waitFor({
  state: "visible",
  timeout: 30000
});

await manualBookingButton.click();

console.log('Manual Booking clicked successfully');

await page.waitForTimeout(3000);

//Enter Flight number

// Generate random 4-digit Flight Number
const randomFlightNo = Math.floor(1000 + Math.random() * 9000).toString();

const flightNoInput = page.locator('input[name="FlightNo"]');

await flightNoInput.waitFor({
    state: "visible",
    timeout: 30000
});

await flightNoInput.click();
await flightNoInput.fill(randomFlightNo);

console.log(`Flight Number entered: ${randomFlightNo}`);

await page.waitForTimeout(3000);

//Select Date for flight booking

const flightDatePicker = page.locator(
    '[data-testid="export-ui-flights-manual-booking-flight-date-datepicker"]'
);

const flightDateInput = flightDatePicker.locator(
    'input.igx-date-picker__input-date'
);

// Calculate tomorrow's date
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

// Format: dd MM yyyy
const day = String(tomorrow.getDate()).padStart(2, '0');
const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
const year = tomorrow.getFullYear();

const tomorrowDate = `${day} ${month} ${year}`;

console.log(`Tomorrow's Flight Date: ${tomorrowDate}`);

await flightDateInput.click();
await flightDateInput.fill(tomorrowDate);
await flightDateInput.press('Enter');

console.log('Tomorrow Flight Date selected successfully');
await page.waitForTimeout(3000);

//Save flight booking

const saveFlightDetailsButton = page.locator(
    '[data-testid="export-ui-flights-button-72"]'
);

await saveFlightDetailsButton.waitFor({
    state: "visible",
    timeout: 30000
});

await saveFlightDetailsButton.click();

console.log('Save Flight Details clicked successfully');

await page.waitForTimeout(3000);

const yesButton = page.locator(
    '[data-testid="export-ui-flights-button-86"]'
);

await yesButton.click();

console.log('YES button clicked successfully');
await page.waitForTimeout(3000);




// Submit To GHA button
const submitToGHABtn = page.locator(
  '[data-testid="export-ui-master-page-button-30"]'
).first();

await submitToGHABtn.waitFor({
  state: "visible",
  timeout: 60000
});

await submitToGHABtn.click();

console.log("Submit To GHA button clicked");

await page.waitForTimeout(3000);

// Generate Token button
const generateTokenBtn = page.locator(
    '[data-testid="export-ui-master-page-button-32"]'
).first();

await generateTokenBtn.waitFor({
    state: "visible",
    timeout: 60000
});

await generateTokenBtn.click();

console.log("Generate Token button clicked");

await page.waitForTimeout(3000);

// Get all enabled slot radio buttons
const firstSlot = page.locator('input[name="slotduration"]:not([disabled])').first();

await firstSlot.waitFor({ state: "attached", timeout: 60000 });

await page.evaluate(() => {
  const slot = document.querySelector('input[name="slotduration"]:not([disabled])');
  if (slot) {
    slot.click();
  }
});

console.log("Slot selected");


await page.waitForTimeout(3000);

// Generate a random 5-digit number
const randomNumber = Math.floor(10000 + Math.random() * 90000);
const vehicleNumber = `AP${randomNumber}`;

// Vehicle Number
const vehicleNo = page.locator(
    '[data-testid="tsm-ui-book-slot-vehicle-no-0"]'
);

await vehicleNo.waitFor({
    state: "visible",
    timeout: 60000
});

await vehicleNo.click();
await vehicleNo.fill(vehicleNumber);

console.log(`Vehicle Number entered: ${vehicleNumber}`);

await page.waitForTimeout(3000);

// Driver Name

const driverName = page.locator('[data-testid="tsm-ui-book-slot-driver-name-0-input"]');

await driverName.waitFor({ state: 'visible' });
await driverName.click();
await driverName.fill('Tester');

await page.waitForTimeout(3000);

//Driver Phone Number

const driverMobile = page.locator('[data-testid="tsm-ui-book-slot-driver-mobile-0"]');

await driverMobile.waitFor({ state: 'visible' });
await driverMobile.click();
await driverMobile.fill('9987909090');

await page.waitForTimeout(3000);


//Driver Liecense

const driverLicense = page.locator('[data-testid="tsm-ui-book-slot-driver-license-0"]');

await driverLicense.waitFor({ state: 'visible' });
await driverLicense.click();
await driverLicense.fill('DL99019');

await page.waitForTimeout(3000);

//click slot save 

const saveButton = page.locator('[data-testid="tsm-ui-save-slot"]');

await saveButton.waitFor({ state: 'visible' });
await saveButton.click();

await page.waitForTimeout(3000);

//Select payment mode

// Click Payment Method dropdown
const paymentMethod = page.locator(
    '[data-testid="tsm-ui-save-charges-payment-method-select"]'
);

await paymentMethod.locator(
    'igx-suffix.igx-select__toggle-button'
).click();

console.log('Payment Method dropdown opened');

await page.waitForTimeout(500);

// Select Cash
const cashOptionpay = page.locator(
    '[data-testid="tsm-ui-save-charges-payment-method-option-1"]'
);

await cashOptionpay.click();

console.log('Cash selected successfully');
await page.waitForTimeout(3000);
//Paynow

const payNowButton = page.locator('[data-testid="tsm-ui-save-charges-pay-now"]');

await payNowButton.waitFor({ state: 'visible' });
await payNowButton.click();

await page.waitForTimeout(3000);

//GHA Login
    await page.goto("https://tst.budaccs.com/login");

    // Login
    await page.locator("#txtEmailId,[data-testid='shared-login-username-input']").fill("tpsuat@yopmail.com");
    await page.locator("[data-testid='shared-login-password-input']").fill("Kale_123");
    await page.locator("[data-testid='shared-login-btn-login-id']").click();
await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Export
     await page.goto("https://tst.budaccs.com/TSM/YardCheckIn");
await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);


//click on 3dots in vehicle number

const filterMenu = page.locator(
    'igx-grid-header[aria-colindex="8"] .igx-excel-filter__icon'
);

await filterMenu.waitFor({
    state: "visible",
    timeout: 60000
});

await filterMenu.click();
    await page.waitForTimeout(3000);

//Search with vehicle number
const searchInput = page.locator(
    'igx-excel-style-search input[placeholder="Search"]'
);

await searchInput.waitFor({
    state: "visible",
    timeout: 60000,
});

await searchInput.click();
await searchInput.fill(vehicleNumber);

console.log(`Entered Vehicle Number: ${vehicleNumber}`);

await page.waitForTimeout(3000);

//click apply

const applyButton = page.locator(
    'igx-excel-style-search .igx-excel-filter__apply button'
).first();

await applyButton.waitFor({
    state: "visible",
    timeout: 60000,
});

await applyButton.click();

console.log("Clicked Apply button");

await page.waitForTimeout(3000);

//Click checkIn

const checkInButton = page.locator(
    '[data-testid="tsm-ui-yard-check-in-row-checkin-out-0"]'
);

await checkInButton.waitFor({
    state: "visible",
    timeout: 60000
});

await checkInButton.click();

console.log("Clicked Check-In/Check-Out button");
await page.waitForTimeout(3000);


 // Navigate to DockManagement
    await page.goto("https://tst.budaccs.com/TSM/DockManagement");

await page.waitForLoadState("networkidle");
await page.waitForTimeout(3000);

//click on Refresh Button

const refreshButton = page.locator(
    '[data-testid="tsm-ui-dock-management-refresh"]'
);

await refreshButton.waitFor({
    state: "visible",
    timeout: 60000,
});

await refreshButton.click();

console.log("Clicked Refresh button");
    await page.waitForTimeout(3000);

// Find the Assign Dock link for the card containing the vehicle number
// Find the Assign Dock link for the card containing the vehicle number
await page.evaluate((vehicleNumber) => {
    const cards = document.querySelectorAll('.assign-dock-card');

    for (const card of cards) {
        if (card.innerText.includes(vehicleNumber)) {
            const assignBtn = card.querySelector(
                'a[data-testid^="tsm-ui-dock-management-assign-dock-"]'
            );

            if (assignBtn) {
                assignBtn.click();
                return;
            }
        }
    }

    throw new Error(`Vehicle ${vehicleNumber} not found.`);
}, vehicleNumber);

console.log(`Clicked Assign Dock for ${vehicleNumber}`);

await page.waitForTimeout(3000);

//Select Dock

// Wait for the popup to appear
await page.waitForTimeout(3000);

// Select the first available radio option
await page.evaluate(() => {
    const radio = document.querySelector(
        'input[data-testid="tsm-ui-dock-management-is-selected-2"]'
    );

    if (!radio) {
        throw new Error("No radio option found.");
    }

    radio.click();
});

console.log("Selected first available option");

// Click Assign
const assignBtn = page.locator(
    '[data-testid="tsm-ui-dock-management-assign-dock-submit"]'
);

await assignBtn.waitFor({
    state: "visible",
    timeout: 60000,
});

await assignBtn.click();

console.log("Clicked Assign button");
await page.waitForTimeout(3000);



// Navigate to Slot Dock Summary
    await page.goto("https://tst.budaccs.com/TSM/SlotDockSummary");

await page.waitForLoadState("networkidle");
await page.waitForTimeout(3000);

//Search withVehicle number

const vehicleFilter = page.locator(
  '[data-testid="tsm-ui-slot-dock-summary-grid-filter-VehicleNo"]'
);

await vehicleFilter.waitFor({ state: "visible", timeout: 30000 });
await vehicleFilter.click();
await vehicleFilter.fill(vehicleNumber);
await vehicleFilter.press("Enter");
    await page.waitForTimeout(3000);

//CLick on View Icon

const viewBtn = page.locator(
  '[data-testid="tsm-ui-slot-dock-summary-row-view-0"]'
);

await viewBtn.waitFor({ state: "visible", timeout: 30000 });
await viewBtn.click();
await page.waitForTimeout(3000);

//Click DockIn Button

const dockInBtn = page.locator(
  '[data-testid="tsm-ui-slot-dock-summary-dock-in"]'
);

await dockInBtn.waitFor({ state: "visible", timeout: 30000 });
await dockInBtn.click();
await page.waitForTimeout(3000);

//Click submit DockIN

const submitBtnDockIN = page.locator(
  '[data-testid="tsm-ui-slot-dock-summary-dock-time-submit"]'
);

await submitBtnDockIN.waitFor({ state: "visible", timeout: 30000 });
await submitBtnDockIN.click();
await page.waitForTimeout(3000);

//Click Action button

const actionBtn = page.locator(
  '[data-testid^="tsm-ui-slot-dock-summary-wh-action-"]'
).first();

await actionBtn.waitFor({ state: "visible", timeout: 60000 });
await actionBtn.click();
await page.waitForTimeout(3000);

//Submit Warehouse

const submitBtnwarehous = page.locator(
  '[data-testid="tsm-ui-slot-dock-summary-warehouse-submit"]'
);

await submitBtnwarehous.waitFor({ state: "visible", timeout: 30000 });
await submitBtnwarehous.click();
await page.waitForTimeout(15000);

//Click on Dock out

const dockOutBtn = page.locator(
  '[data-testid="tsm-ui-slot-dock-summary-dock-out"]'
);

await dockOutBtn.waitFor({ state: "visible", timeout: 30000 });
await dockOutBtn.click();
await page.waitForTimeout(3000);

//Click on Time Icon to change dockout time 

const clockIcon = page.locator('igx-icon[title="Change Time"]');

await clockIcon.waitFor({ state: "visible", timeout: 30000 });
await clockIcon.click();
await page.waitForTimeout(3000);

//Pick Time
// Focus the selected minute column
const minuteColumn = page.locator('.igx-time-picker__minuteList');

await minuteColumn.click();

// Move 2 minutes forward
await minuteColumn.press('ArrowDown');
await minuteColumn.press('ArrowDown');

// Click OK
const okBtn = page.locator('.igx-time-picker__buttons button').nth(1);

await okBtn.waitFor({ state: "visible" });
await okBtn.click();

await page.waitForTimeout(3000);

//Submit Dockout

const dockOutSubmitBtn = page.locator(
  '[data-testid="tsm-ui-slot-dock-summary-dock-time-submit"]'
);

await dockOutSubmitBtn.waitFor({ state: "visible", timeout: 30000 });
await dockOutSubmitBtn.click();

await page.waitForTimeout(3000);


  } finally {
    await page.close();
  }
}
