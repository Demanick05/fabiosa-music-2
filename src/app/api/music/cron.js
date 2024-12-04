import setupCronJobs from '../../utils/cron';

let cronInitialized = false;

export default function handler(req, res) {
  if (!cronInitialized) {
    setupCronJobs();
    cronInitialized = true; // Ensure the job is initialized only once
    console.log('Cron jobs initialized successfully.');
  }
  res.status(200).json({ message: 'Cron jobs are running.' });
}
