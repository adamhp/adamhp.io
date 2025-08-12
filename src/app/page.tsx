const currentWork = [
  {
    title: 'Agile Defense',
    description:
      'I am a full-time Staff Engineer and Solutions Architect for Agile Defense. I consult on cybersecurity software and other technical solutions for the public sector.',
    link: 'https://agiledefense.com',
  },
  {
    title: 'Pearce Labs',
    description:
      'My digital services agency focused on web design, software, and business automation serving local small businesses.',
    link: 'https://pearcelabs.com',
  },
  {
    title: 'multiborder.io',
    description:
      'An iOS app for adding borders to multiple images while preserving aspect ratio. Think digital matting.',
    link: 'https://multiborder.io',
  },
];

const pastWork = [
  {
    title: 'XOR Security',
    description:
      'Software developer at a boutique cyber-oriented software company. Grew from 10 employees to 150+ before being acquired by Enlightenment Capital.',
    link: 'https://www.crunchbase.com/acquisition/agile-defense-acquires-xor-security--c4bddf80',
  },
  {
    title: 'oeno.chat',
    description:
      'An exploratory weekend project using ChatGPT to find the best wine pairings for food.',
    link: 'https://oeno.chat',
  },
  {
    title: 'lasso.so',
    description:
      'A two-sided marketplace SaaS product for creators and brands, with media kits for creators and campaign management for brands.',
    link: '',
  },
  {
    title: 'wildfire.so',
    description:
      "A SaaS product that analyzed creators' Twitter audiences to discover unique customer profiles to derive opportunities for monetization.",
    link: '',
  },
];

function WorkItem({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <dl className='grid grid-cols-3 my-4'>
      <dt>{link != '' ? <a href={link}>{title}</a> : title}</dt>
      <dd className='col-span-2'>{description}</dd>
    </dl>
  );
}

export default function Home() {
  return (
    <div className='font-sans mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen text-lg text-stone-300'>
      <div className='mx-auto max-w-3xl  h-fit flex flex-col mt-32'>
        <div>
          <h1>About</h1>
          <p>
            Hey, I&apos;m Adam! I&apos;m a full-stack software engineer. I have
            spent the last ten years building software products and pursuing
            creativity.
          </p>
          <p>
            I like taking <a href='https://adamhp.photos'>photos</a>.
          </p>
        </div>

        <div>
          <div className='flex flex-row items-baseline justify-between border-b-2 border-stone-800'>
            <h1>Current Work</h1>
            <div className='flex flex-row space-x-4'>
              <a href='https://www.github.com/adamhp'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='lucide lucide-github-icon lucide-github w-8 h-8 -mb-2'
                >
                  <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' />
                  <path d='M9 18c-4.51 2-5-2-7-2' />
                </svg>
              </a>
              <a href='https://www.linkedin.com/in/adamhp'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='lucide lucide-linkedin-icon lucide-linkedin w-8 h-8 -mb-2'
                >
                  <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
                  <rect width='4' height='12' x='2' y='9' />
                  <circle cx='4' cy='4' r='2' />
                </svg>
              </a>
            </div>
          </div>
          {currentWork.map((work) => (
            <WorkItem key={work.title} {...work} />
          ))}
        </div>
        <div>
          <div className='flex flex-row items-baseline justify-between border-b-2 border-stone-800'>
            <h1>Past Work</h1>
          </div>
          {pastWork.map((work) => (
            <WorkItem key={work.title} {...work} />
          ))}
        </div>
      </div>
    </div>
  );
}
