// Replace the PDF in /public/resume to update the resume; keep the file name or change it here.
export const RESUME = {
  url: 'resume/Karanam_Selvakumar_Chaaruseelan_Resume.pdf',
  fileName: 'Karanam_Selvakumar_Chaaruseelan_Resume.pdf',
  owner: 'Karanam Selvakumar Chaaruseelan',
};

export const openResume = () => window.dispatchEvent(new CustomEvent('kscs:open-resume'));
