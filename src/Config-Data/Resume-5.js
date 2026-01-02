export const initialResumeData = {
  personalInfo: {
    name: 'Muhammad Waqar',
    title: 'Senior Frontend Developer',
    summary:
      'A motivated computer engineer and senior frontend developer with 6+ years of experience, willing to explore opportunities and learn new technologies. An enthusiastic problem solver proficient in modern web technologies, with a focus on delivering seamless and efficient user experiences. Seeking to leverage skills in a dynamic team environment to drive forward-looking web solutions.',
    phone: '',
    email: 'muhammad.waqar.dev@gmail.com',
    location: 'Karachi, Pakistan',
    github: 'https://github.com/muhammad-waqar-dev',
    linkedin: 'https://www.linkedin.com/in/muhammad-waqar-dev/',
    portfolio: '',
    profileImage: ''
  },
  workExperience: [
    {
      id: 1,
      company: 'Aciano Technology (SAAS, Remote)',
      role: 'Senior Software Engineer',
      location: 'Remote',
      startDate: 'Dec 2023',
      endDate: 'Present',
      description:
        'Working as a Senior Software Developer on Norstella "Fusion" products, featuring Micro-Frontend and Micro-Services architecture. Focused on delivering better user experience and scalable code within a large, multicultural team.',
      achievements: [
        'Developing Micro-Frontend solutions using React, Redux, TypeScript, and Material UI.',
        'Implementing features using TDD (Jest) and maintaining strict PR reviews in an agile system.',
        'Utilizing Data Science and AI tools (OpenAI, Gemini) for complex application needs.',
        'Collaborating with 100+ developers across different international teams.'
      ]
    },
    {
      id: 2,
      company: 'Pakistan Single Window (SAAS, Hybrid)',
      role: 'Software Engineer II',
      location: 'Hybrid',
      startDate: 'Mar 2022',
      endDate: 'Dec 2023',
      description:
        'Architected and developed generic, reusable solutions following clean code design principles. Managed software releases and collaborated with stakeholders to ensure secure and scalable systems.',
      achievements: [
        'Received "Best Employee" award in 2023 for outstanding contributions.',
        'Architected generic components for maintainability and extensibility.',
        'Oversaw release management using Git-flow and efficient testing workflows.',
        'Ensured functional, secure, and user-friendly software systems.'
      ]
    },
    {
      id: 3,
      company: 'Ivolve.io (Start-up, IAAS, SAAS, Onsite)',
      role: 'Full Stack Software Engineer',
      location: 'Onsite',
      startDate: 'Nov 2019',
      endDate: 'Mar 2022',
      description:
        'Designed and developed hybrid cloud solutions (IAAS/SAAS) using React, Next.js, Node.js, and Python. Led and mentored a development team from junior to mid-senior roles.',
      achievements: [
        'Secured two promotions and received two "Best Employee" awards during the tenure.',
        'Implemented micro-service-based architecture on AWS, Redhat, and Openstack.',
        'Managed entire development, QA, and release cycles, including data migration.',
        'Collaborated with DevOps to manage global CI/CD pipelines.'
      ]
    }
  ],
  projects: [
    {
      id: 1,
      name: 'Fusion App',
      year: '2023',
      description:
        'Enterprise Pharma product (drug development life cycle system) combining 5 different products into a single platform solution.',
      details: [
        'Developed with React.js, Zustand, MaterialUI, TypeScript, Java, and AWS.',
        'Micro-Service and Micro-Frontend based architecture.',
        'Automated complete drug development cycles.',
        'Integrated Citeline, Evaluate, MMIT, Neeve, and Confluence.'
      ]
    },
    {
      id: 2,
      name: 'PSW (Pakistan Single Window)',
      year: '2022',
      description:
        'Digitalized manual government processes for premises registration and trader personal deposit accounts.',
      details: [
        'Built using React.js, Redux, KendoUI, TypeScript, and .NetCore.',
        'Integrated PDA accounts and created separate micro-frontend services.',
        'Developed uni-pattern architect and generic reusable components.',
        'Managed end-to-end frontend services for 24/7 operations.'
      ]
    },
    {
      id: 3,
      name: 'CMP (Cloud Management Portal)',
      year: '2020',
      description:
        'Fully managed hybrid cloud platform integrating AWS, Redhat, VMware, and Openstack.',
      details: [
        'Built with React, Redux, NextJS, NodeJS, and Ant Design.',
        'Implemented single billing account and one-window monitoring.',
        'Integrated on-premises infrastructure with multiple cloud providers.',
        'Developed Python micro-services using SQL and NoSQL databases.'
      ]
    }
  ],
  education: [
    {
      id: 1,
      institution: 'NED University, Karachi, Pakistan',
      degree: 'Master’s in Data Science',
      startDate: '2024',
      endDate: '2026'
    },
    {
      id: 2,
      institution: 'University of Karachi, Karachi, Pakistan',
      degree: 'Bachelor’s in Computer Science',
      startDate: '2015',
      endDate: '2018'
    }
  ],
  skills: [
    'TypeScript',
    'JavaScript',
    'React',
    'React Native',
    'Angular',
    'VueJS',
    'NextJS',
    'NodeJS',
    'Python',
    'Asp .Net',
    'Redux',
    'Zustand',
    'Material UI',
    'Tailwind',
    'PostgreSQL',
    'MongoDB',
    'SQL',
    'Rest API',
    'TDD',
    'Jest',
    'Cypress',
    'Docker',
    'Kubernetes',
    'AWS',
    'Microservices',
    'Micro Frontend',
    'CI/CD'
  ],
  certifications: [],
  softSkills: [
    'Problem-solving',
    'Team Mentorship',
    'Agile Methodology',
    'Professional Communication',
    'Technical Architecture'
  ],
  languages: ['English', 'Urdu', 'Hindi']
}

export const availableSections = [
  { key: 'personalInfo', label: 'Personal Info', required: true },
  { key: 'workExperience', label: 'Work Experience', required: false },
  { key: 'projects', label: 'Projects', required: false },
  { key: 'education', label: 'Education', required: false },
  { key: 'skills', label: 'Skills', required: false },
  { key: 'certifications', label: 'Certifications', required: false },
  { key: 'softSkills', label: 'Soft Skills', required: false },
  { key: 'languages', label: 'Languages', required: false }
]

export const initialSectionOrder = [
  'workExperience',
  'projects',
  'education',
  'skills',
  'certifications',
  'softSkills',
  'languages'
]

