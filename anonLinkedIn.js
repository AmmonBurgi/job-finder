import puppeteer from 'puppeteer';

// Title can be a job title, skill, or company.
const TITLE_SEARCH = 'Software Engineer';

// Location can be a city, state, zip, or country.
const LOCATION_SEARCH = 'Texas, United States';

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

const jobData = [];

const browser = await puppeteer.launch({
  headless: false, 
  args: ['--start-maximized'],
  slowMo: 25,
});

const startSearch = async (page, title, location) => {
  try {
    // Start the initial search, providing the title and location.
    await page.locator('input[aria-label="Search job titles or companies"]').fill(title);
    await page.locator('input[aria-label="Location"]').fill(location);
    await page.keyboard.press('Enter');

  } catch (error) {
    console.error("Search failed: ", error);
  }
}

const filterOptions = async (page, {
  datePosted,
  experienceLevel,
  salary,
  jobType,
  remoteOptions,
}) => {
  try {
    console.log('---Filtering---');
    
    const filterListElement = await page.$('.filters__list');
    const selectOption = async (selector, option) => {
      const selected = await filterListElement.$(`li:nth-of-type(1)`);
      await selected.$('div:nth-of-type(1) > div:nth-of-type(1) > button').click();
      await selected.$(option).click();
      await selected.$('.filter__submit-button').click();
    }

    await selectOption("1", FILTER_SELECTORS.datePosted[datePosted]);
    await selectOption("4", FILTER_SELECTORS.experienceLevel[experienceLevel]);
    await selectOption("6", FILTER_SELECTORS.salary[salary]);
    await selectOption("3", FILTER_SELECTORS.jobType[jobType]);

    // await page.locator(``).click();
    // await page.locator(FILTER_SELECTORS.datePosted[datePosted]).click();
    // await page.locator('.filter__submit-button').click();
    
    // await page.locator(`.filters__list > li:nth-of-type(4) ${buttonSelector}`).click();
    // await page.locator(FILTER_SELECTORS.experienceLevel[experienceLevel]).click();
    // await page.locator('.filter__submit-button').click();

    // await page.locator(`.filters__list > li:nth-of-type(6) ${buttonSelector}`).click();
    // await page.locator(FILTER_SELECTORS.salary[salary]).click();
    // await page.locator('.filter__submit-button').click();

    // await page.locator(`.filters__list > li:nth-of-type(3) ${buttonSelector}`).click();
    // await page.locator(FILTER_SELECTORS.jobType[jobType]).click();
    // await page.locator('.filter__submit-button').click();

    // for (const option of remoteOptions) {
      // await page.locator('.filters__list > li:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(1) > button').click();
      //   await page.locator(FILTER_SELECTORS.remote[option]).click();
    // }

    // Click on the "Show results" button to apply the filters.
    // await page.locator('.reusable-search-filters-buttons.search-reusables__secondary-filters-show-results-button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view').click();
  } catch (error) {
    console.error("Filtering failed: ", error);
  }
}

const extractJobData = async (page) => {
  try {
    const jobPostings = await page.$$('.scaffold-layout__list  > div:nth-of-type(1) > ul:nth-of-type(1) > li');

    console.log(jobPostings);

    const title = await jobPostings[0].$eval(
      'div.artdeco-entity-lockup__subtitle.ember-view span',
      el => el.textContent.trim()
    )

    console.log(title);

    // await jobPostings[2].hover();
    // await jobPostings[2].click();

    // for (const job of jobPostings) {
    //   await job.hover();
    //   await new Promise(r => setTimeout(r, 1000));

    //   await job.click();
    // }

    // for (const jobPost of jobPostings) {
    //   const title = await jobPost.$eval(
    //     'h3.base-search-card__title', 
    //     el => el.textContent.trim()
    //   );
      
    //   const company = await jobPost.$eval(
    //     'h4.base-search-card__subtitle', 
    //     el => el.textContent.trim()
    //   );
    
    //   const location = await jobPost.$eval(
    //     'span.job-search-card__location',
    //     el => el.textContent.trim()
    //   );
    
    //   const url = await jobPost.$eval(
    //     'a.base-card__full-link', 
    //     el => el.href
    //   );
    
    //   jobData.push({title, company, location, url});
    // }
  } catch (error) {
    console.error("Extracting job details failed: ", error);
  }
}

const triggerScraping = async () => {
  try {
    console.log('---Launching Puppeteer---');

    // Launch the browser and open a new blank page
    const page = await browser.newPage();
  
    const screen = await page.evaluate(() => ({
      width: window.screen.availWidth,
      height: window.screen.availHeight
    }));
    await page.setViewport(screen);
    
    // Navigate to jobs page.
    await page.goto('https://www.linkedin.com/jobs/search');
    await page.locator(`.filters__list`).click();

    // await startSearch(page, TITLE_SEARCH, LOCATION_SEARCH);

    await filterOptions(page, {
      datePosted: 'pastWeek',
      experienceLevel: 'associate',
      salary: 'hundredPlus',
      jobType: 'fullTime',
      remoteOptions: ['onSite', 'hybrid'],
    })

    console.log('---Search complete---')
    
    // await extractJobData(page);
    // await browser.close();
  } catch (error) {
    console.error("Puppeteer failed:", error);
    browser.close();
    process.exit(1);
  }
}

// tryOpenAI();
triggerScraping(); 