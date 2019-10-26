import { format, parseISO } from 'date-fns';
import Mail from "../../lib/mail";

class AnswerMail {
  key() {
    return "AnswerMail";
  }

  async handle({ data }) {
    const { helpOrder } = data;

    Mail.sendMail({
      to: `${helpOrder.Student.name} <${helpOrder.Student.email}>`,
      subject: `Pergunta Respondida`,
      template: 'answer',
      context: {
        student: helpOrder.Student.name,
        date: format(parseISO(helpOrder.answer_at), 'dd/MM/yyyy HH:mm:ss'),
        question: helpOrder.question,
        answer: helpOrder.answer
      }
    });
  }

}

export default new AnswerMail();
