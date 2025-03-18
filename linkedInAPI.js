import linkedIn from 'linkedin-jobs-api';

const queryOptions = {
  keyword: 'software engineer',
  location: 'Utah',
  dateSincePosted: '24hr',
  jobType: 'full time',
  remoteFilter: 'on site',
  salary: '800000',
  experienceLevel: 'entry level',
  limit: '100',
  page: "0",
};


const tryLinkedIn = async () => {
  try {
    linkedIn.query(queryOptions).then(response => {
      console.log(response); // An array of Job objects
    });
  } catch (error) {
    console.error("LinkedIn failed:", error);
    process.exit(1);
  }
}

tryLinkedIn();