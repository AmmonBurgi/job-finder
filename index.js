import DotEnv from "dotenv";
DotEnv.config();

// import OpenAI from "openai";
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

import puppeteer from 'puppeteer';

const FILTER_SELECTORS = {
  datePosted: {
    any: '#advanced-filter-timePostedRange-',
    past24hr: '#advanced-filter-timePostedRange-r86400',
    pastWeek: '#advanced-filter-timePostedRange-r604800',
    pastMonth: '#advanced-filter-timePostedRange-r2592000',
  },
  experienceLevel: {
    internship: '#advanced-filter-experience-1',
    entryLevel: '#advanced-filter-experience-2',
    associate: '#advanced-filter-experience-3',
    midSeniorLevel: '#advanced-filter-experience-4',
    director: '#advanced-filter-experience-5',
    executive: '#advanced-filter-experience-6',
  },
  salary: {
    fortyPlus: '',
    sixtyPlus: '',
    eightyPlus: '',
    hundredPlus: '',
    hundredTwentyPlus: '',
    hundredFortyPlus: '',
    hundredSixtyPlus: '',
    hundredEightyPlus: '',
    twoHundredPlus: '',
  }, 
  jobType: {
    fullTime: '',
    partTime: '',
    contract: '',
    temporary: '',
    internship: '',
    volunteer: '',
    other: '',
  },
  remote: {
    onSite: '',
    remote: '',
    hybrid: '',
  }
}

// const tryOpenAI = async () => {
//   try {
//       const completion = await client.chat.completions.create({
//           model: "gpt-4o",
//           messages: [{
//               role: "user",
//               content: `Where did "Hello World" originate from?`,
//           }],
//       });
      
//       console.log(completion.choices[0].message.content);
//   } catch (error) {
//       console.error("AI completion failed:", error);
//       process.exit(1);
//   }
// }

const browser = await puppeteer.launch({headless: false});

const filterOptions = async (page, {
  datePosted,
  experienceLevel,
  salary,
  jobType,
  remote,
}) => {
  try {
    console.log('---Filtering---');

    await page.locator('text=All filters').click();

    console.log(FILTER_SELECTORS.datePosted[datePosted]);
    await page.locator(`#artdeco-modal-outlet ${FILTER_SELECTORS.datePosted[datePosted]}`).click();

  } catch (error) {
    console.error("Filtering failed: ", error);
  }
}

const triggerScraping = async () => {
  try {
    console.log('---Launching Puppeteer---');

    // Launch the browser and open a new blank page
    const page = await browser.newPage();
    
    // Navigate the page to Linkedin.
    await page.goto('https://www.linkedin.com');

    // Click on the sign in button.
    await page.locator('a.nav__button-secondary.btn-secondary-emphasis.btn-md').click();

    // Wait while manually providing the login credentials.
    // TODO: Use browser cookies instead
    await new Promise(r => setTimeout(r, 15000));

    await page.goto('https://www.linkedin.com/jobs/search');

    // await page
    //   .locator('button')
    //   .filter(button => button.innerText == 'All filters')
    //   .click();

    // const [button] = await page.$x('//button[contains(text(), "All filters")]');
    // if (button) await button.click();

    await filterOptions(page, {
      datePosted: 'past24hr',
      experienceLevel: 'entry level',
      salary: '80000',
      jobType: 'full time',
      remote: []
    })
    
    // await browser.close();
  } catch (error) {
    console.error("Puppeteer failed:", error);
    browser.close();
    process.exit(1);
  }
}

// tryOpenAI();
triggerScraping(); 