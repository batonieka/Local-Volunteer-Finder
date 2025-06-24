import { readDataFromFile, writeDataToFile } from './fileUtils';
import { VolunteerOpportunity } from '../types';
import { sendEmailStub } from './emailService';
import { logger } from './logger';

export const checkAndSendReminders = async () => {
  const opportunities = await readDataFromFile();
  const now = new Date();
  const reminderThreshold = 3; // days before the event

  const updated = opportunities.map(op => {
    const opDate = new Date(op.date);
    const diffInDays = Math.floor((opDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (!op.reminderSent && diffInDays <= reminderThreshold && diffInDays >= 0) {
      sendEmailStub({
        to: 'volunteer@example.com',
        subject: `Reminder: ${op.title} is happening soon!`,
        message: `
⏰ Don't forget your upcoming opportunity!

📌 ${op.title}
📍 ${op.location}
📆 ${op.date}

Thanks for volunteering!
        `
      });

      logger.info(`Reminder sent for opportunity ${op.id}`);
      return { ...op, reminderSent: true };
    }

    return op;
  });

  await writeDataToFile(updated);
};
