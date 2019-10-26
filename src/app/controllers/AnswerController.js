import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/queue';
import AnswerJob from '../job/AnswerMail';

class AnswerController {

  async index(req, res) {

    const pageSize = process.env.PAGE_SIZE;
    const { page = 1 } = req.query;

    const helps = await HelpOrder.findAll({
      where: { answer_at: null },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: ['created_at']
    });

    return res.json(helps);
  }

  async store(req, res) {

    const { id } = req.params;

    const { answer } = req.body;
    if (!answer) {
      return res.status(400).json({ error: 'Answer no provider' });
    }

    const helpOrder = await HelpOrder.findByPk(id, {
      include: [{ model: Student }]
    });
    if (!helpOrder) {
      return res.status(400).json({ error: 'Question not found' });
    }

    const { question } = await helpOrder.update({
      answer,
      answer_at: new Date()
    });

    await Queue.add(AnswerJob, { helpOrder });

    // Queue.processQueue();

    return res.json({
      id,
      question,
      answer
    });
  }
}

export default new AnswerController();
