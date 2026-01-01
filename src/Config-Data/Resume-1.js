export const initialResumeData = {
    personalInfo: {
      name: 'John Doe',
      title: 'Software Developer',
      summary: 'Resourceful Developer with 4+ years of experience in designing and developing user interfaces, testing and training employees. Skilled at utilizing a wide variety of tools and programs to provide effective applications.',
      phone: '+91-9999999999',
      email: 'john.doe@gmail.com',
      location: 'Karachi, Sindh, Pakistan',
      github: 'https://github.com/xx-xx-xx',
      linkedin: 'https://www.linkedin.com/in/xx-xx-xx/',
      portfolio: '',
      profileImage: 'https://media.licdn.com/dms/image/v2/D4D03AQFqHwZ79Vp4-g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1735599452348?e=1746105600&v=beta&t=Lx534jVZiZwUo1NQOZCq2E-eJFwV84Fc_0VJcx3aE-s'
    },
    workExperience: [
      {
        id: 1,
        company: 'Weekday',
        role: 'SDE 1',
        location: 'Bengaluru',
        startDate: 'Aug 2020',
        endDate: 'Present',
        description: "Developed, tested, and maintained software solutions for ARC LLC's flagship product. Collaborated with cross-functional teams to deliver high-quality solutions and solve technical challenges.",
        achievements: [
          'Led the implementation of a new feature that increased user engagement by 25%.',
          'Optimized the product\'s backend performance, reducing load times by 40%.',
          'Collaborated with product managers and UX/UI designers to ensure the features met customer requirements and improved user experience.',
          'Contributed to the migration of the codebase to a microservices architecture, improving scalability and reducing system downtime.',
          'Participated in code reviews and mentored junior developers on best practices and coding standards.'
        ]
      }
    ],
    projects: [
      {
        id: 1,
        name: 'Robotics',
        year: '2019',
        description: 'Created a mecanum wheel robot with a multidirectional arm capable of complex movements and automation.',
        details: [
          'Successfully designed and built a robot with mecanum wheels for omnidirectional movement.',
          'Developed a control system to coordinate the robot\'s arm and wheel movement for precise tasks.',
          'Improved arm accuracy and speed by implementing custom software for motion planning.',
          'Won 2nd place in a regional robotics competition for innovation and functionality.'
        ]
      }
    ],
    education: [
      {
        id: 1,
        institution: 'University of Karachi, Karachi',
        degree: 'Bachelor of Science in Computer Science',
        startDate: 'Aug 2016',
        endDate: 'Jul 2020'
      }
    ],
    skills: ['JavaScript', 'Python', 'Web Services', 'C++', 'HTML5', 'CSS', 'SQL', 'User Interface'],
    certifications: [
      'Certified Web Professional-Web Developer',
      'Java Development Certified Professional'
    ],
    softSkills: ['Collaboration', 'Problem-solving', 'Communication', 'Time management', 'Result-oriented'],
    languages: ['English', 'Urdu']
  }

  // Available sections configuration
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
  
  // Initial section order (excluding personalInfo which is always first)
export const initialSectionOrder = [
    'workExperience',
    'projects',
    'education',
    'skills',
    'certifications',
    'softSkills',
    'languages'
  ]