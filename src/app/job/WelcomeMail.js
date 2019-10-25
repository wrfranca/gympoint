import { format, parseISO } from 'date-fns';
import Mail from '../../lib/mail';

class WelcomeMail {
  key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {

    const { enrolment } = data;

    await Mail.sendMail({
      to: `${enrolment.Student.name} <${enrolment.Student.email}>`,
      subject: `Bem Vindo ao Gympoint`,
      template: 'welcome',
      context: {
        student: enrolment.Student.name,
        plan: enrolment.Plan.title,
        duration: enrolment.Plan.duration,
        start_date: format(parseISO(enrolment.start_date), 'dd/MM/yyyy'),
        end_date: format(parseISO(enrolment.end_date), 'dd/MM/yyyy'),
        price: enrolment.Plan.price,
        price_sum: enrolment.price
      }
    });
  }
}

export default new WelcomeMail();
