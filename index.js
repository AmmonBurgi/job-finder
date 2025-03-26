import DotEnv from "dotenv";
DotEnv.config();

// import OpenAI from "openai";
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

import puppeteer from 'puppeteer';

// Values can be CSS selectors or text values. 
const FILTER_SELECTORS = {
  datePosted: {
    any: 'text=Any time',
    past24hr: 'text=Past 24 hours',
    pastWeek: 'text=Past week',
    pastMonth: 'text=Past month',
  },
  experienceLevel: {
    internship: 'text=Internship',
    entryLevel: 'text=Entry level',
    associate: 'text=Associate',
    midSeniorLevel: 'text=Mid-Senior level',
    director: 'text=Director',
    executive: 'text=Executive',
  },
  salary: {
    fortyPlus: 'text=$40,000+',
    sixtyPlus: 'text=$60,000+',
    eightyPlus: 'text=$80,000+',
    hundredPlus: 'text=$100,000+',
    hundredTwentyPlus: 'text=$120,000+',
    hundredFortyPlus: 'text=$140,000+',
    hundredSixtyPlus: 'text=$160,000+',
    hundredEightyPlus: 'text=$180,000+',
    twoHundredPlus: 'text=$200,000+',
  }, 
  jobType: {
    fullTime: 'text=Full-time',
    partTime: 'text=Part-time',
    contract: 'text=Contract',
    temporary: 'text=Temporary',
    internship: 'text=Internship',
    volunteer: 'text=Volunteer',
    other: 'text=Other',
  },
  remote: {
    onSite: 'text=On-site',
    remote: 'text=Remote',
    hybrid: 'text=Hybrid',
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
  remoteOptions,
}) => {
  try {
    console.log('---Filtering---');

    // Click on the "All filters" button to open the filters modal.
    await page.locator('text=All filters').click();

    await page.locator(FILTER_SELECTORS.datePosted[datePosted]).click();
    await page.locator(FILTER_SELECTORS.experienceLevel[experienceLevel]).click();
    await page.locator(FILTER_SELECTORS.salary[salary]).click();
    await page.locator(FILTER_SELECTORS.jobType[jobType]).click();

    for (const option of remoteOptions) {
      await page.locator(FILTER_SELECTORS.remote[option]).click();
    }

    // Click on the "Show results" button to apply the filters.
    await page.locator('.reusable-search-filters-buttons.search-reusables__secondary-filters-show-results-button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view').click();
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
      experienceLevel: 'associate',
      salary: 'hundredPlus',
      jobType: 'fullTime',
      remoteOptions: ['onSite', 'hybrid'],
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