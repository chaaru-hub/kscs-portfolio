const GITHUB = 'https://github.com/chaaru-hub';

// `repo` points at a GitHub search for now — swap in the exact repository URL when ready.
// `live` is where "Visit project" goes; leave it empty to show the button as "Link coming soon".
export const PROJECTS = [
  {
    id: 'resq',
    title: 'ResQ',
    subtitle: 'Smart Disaster Resource Allocation & Emergency Response System',
    category: 'Emergency Tech',
    year: '2026',
    gradient: 'linear-gradient(135deg, #ff3d6e 0%, #ff8a3d 45%, #6f00ff 100%)',
    accent: '#ff5a5f',
    summary:
      'A real-time command platform that maps incidents, ranks urgency and routes rescue resources to where they are needed most.',
    problem:
      'During floods, cyclones and other disasters, relief teams work from fragmented spreadsheets, phone calls and social posts. Requests are duplicated, critical zones are missed, and resources sit idle while people wait.',
    purpose:
      'Give responders a single live picture of every incident and every available resource, and let the system suggest the most effective allocation automatically.',
    highlights: [
      'Interactive Leaflet.js map with live incident clustering and severity heat layers',
      'FastAPI allocation engine that scores requests on severity, population and distance',
      'Resource inventory tracking for shelters, medical kits, boats and volunteers',
      'Role-based dashboards for citizens, field volunteers and command coordinators',
    ],
    stack: ['React', 'Vite', 'Python', 'FastAPI', 'Leaflet.js'],
    repo: `${GITHUB}?tab=repositories&q=ResQ`,
    live: '',
  },
  {
    id: 'ecomind',
    title: 'EcoMind-AI',
    subtitle: 'IoT Energy-Saving Dashboard & Anomaly Detection',
    category: 'IoT · AI',
    year: '2026',
    gradient: 'linear-gradient(135deg, #00e5cc 0%, #00b36b 45%, #0a5cff 100%)',
    accent: '#00e5a0',
    summary:
      'An intelligent energy dashboard that streams IoT sensor data, visualises consumption and flags wasteful anomalies before the bill arrives.',
    problem:
      'Homes and campuses waste a large share of electricity through idle devices and faulty appliances, but consumption data is invisible until the monthly bill — far too late to act.',
    purpose:
      'Turn raw sensor readings into actionable insight: show where energy goes in real time and automatically detect unusual spikes or drains.',
    highlights: [
      'Live Chart.js visualisations of per-device and per-room consumption',
      'Statistical + ML anomaly detection pipeline served through FastAPI',
      'Smart alerts and energy-saving recommendations based on usage patterns',
      'Microcontroller sensor nodes publishing readings to the backend',
    ],
    stack: ['React', 'Vite', 'Python', 'FastAPI', 'Chart.js'],
    repo: `${GITHUB}?tab=repositories&q=EcoMind`,
    live: '',
  },
  {
    id: 'civic-ai',
    title: 'Civic AI',
    subtitle: 'Municipal Grievance Triage & Smart Governance',
    category: 'GovTech · NLP',
    year: '2026',
    gradient: 'linear-gradient(135deg, #6f00ff 0%, #b100ff 45%, #00e5cc 100%)',
    accent: '#9b5cff',
    summary:
      'An NLP-powered grievance portal that reads citizen complaints, classifies and prioritises them, and routes each one to the right department.',
    problem:
      'Municipal offices receive thousands of unstructured complaints across channels. Manual sorting is slow, urgent issues get buried, and citizens rarely see what happened to their report.',
    purpose:
      'Automate triage so every grievance reaches the correct department quickly, with transparent tracking for citizens and analytics for administrators.',
    highlights: [
      'NLP classifier that tags category, department and urgency from free text',
      'Duplicate detection to merge repeated reports of the same issue',
      'SQL-backed ticket lifecycle with status tracking for citizens',
      'Admin analytics on ward-level hotspots and resolution times',
    ],
    stack: ['React', 'Python', 'FastAPI', 'NLP', 'SQL'],
    repo: `${GITHUB}?tab=repositories&q=Civic`,
    live: '',
  },
];
