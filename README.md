# UIUC Grade Statistics Dashboard

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Future Features
* Presets
    * Create pre-rendered groupings of charts for specific majors
        * Ex: CHEM 102/103, MATH 220 or 231, PHY 211, and RHET 105 for PREP students
        * Should be button to add all courses to my courses or replace my courses with preset
* Changing the year frame for the graphs
    * Add an HTML form element that allows the users to change the years for the dataset
* Ability to collapse coureses on the `my-courses` page
* Individual course pages
    * Can be pre-rendered using `getStaticProps` and `getStaticPaths` but this will create a MASSIVE build.
        * Viable option site is being hosted on a VPS
    * Individual course pages can display more information about a specific course than the two charts on the my-course page.
        * Histograms and sun-bursts for each professor in a course
        * Compare distributions for different years
            * How did the distribution of grades from 2020 compare to the distribution of grades in 2019?
* Mobile compatibility
    * Site is only designed for desktop in current state
    * Implement collapsable side menu


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
