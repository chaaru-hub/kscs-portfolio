// Certificate scans live in /public/certificates. If an image is missing,
// a generated card marked "Preview" is shown instead.
export const CERTIFICATIONS = [
  {
    id: 'amd-act-ii',
    title: 'AMD Developer Hackathon: ACT II',
    issuer: 'lablab.ai × Groq',
    type: 'Certificate of Completion',
    date: 'Jul 6–13, 2026',
    description:
      'Awarded for outstanding performance, attendance, and successfully completing and submitting a solution built on Groq in the AMD Developer Hackathon: ACT II.',
    tags: ['Groq', 'LLM Inference', 'Rapid Prototyping'],
    accent: '#3d6bff',
    accent2: '#7a5cff',
    image: 'certificates/amd-developer-hackathon-act-ii.jpg',
    link: 'https://lablab.ai/',
  },
  {
    id: 'isro-bah-2026',
    title: 'Bharatiya Antariksh Hackathon 2026',
    issuer: 'ISRO × Hack2skill',
    type: 'Certificate of Participation',
    date: '2026',
    credentialId: '2026H2S06BAH-P21791',
    description:
      'Recognised for participation and a successful idea submission in the Bharatiya Antariksh Hackathon 2026, presented by the Indian Space Research Organisation (ISRO) and powered by Hack2skill.',
    tags: ['Space Tech', 'Idea Submission', 'National Hackathon'],
    accent: '#ff7a1f',
    accent2: '#3d8bff',
    image: 'certificates/isro-bharatiya-antariksh-hackathon-2026.jpg',
    link: 'https://www.isro.gov.in/',
  },
  {
    id: 'synesis-26',
    title: "SYNESIS '26 Hackathon",
    issuer: 'SRM IST Ramapuram',
    type: 'Certificate of Participation',
    date: '13 Oct 2026',
    description:
      'Took part in SYNESIS ’26, a 6-hour hackathon conducted by SRM Institute of Science and Technology, Ramapuram, with the Departments of CSE (IoT) and CSBS.',
    tags: ['6-Hour Hackathon', 'IoT', 'Rapid Prototyping'],
    accent: '#c9a24a',
    accent2: '#1b2f5e',
    image: 'certificates/synesis-26-hackathon.jpg',
    link: 'https://www.srmist.edu.in/',
  },
];
