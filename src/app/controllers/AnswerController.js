import HelpOrder from '../models/HelpOrder';

class AnswerController {

  async index(req, res) {

    const { page = 1 } = req.query;

    const helps = await HelpOrder.findAll({
      where: { answer_at: null },
      limit: 20,
      offset: (page - 1) * 20,
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

    const helpOrder = await HelpOrder.findByPk(id);
    if (!helpOrder){
      return res.status(400).json({ error: 'Question not found' });
    }

    const { question } = await helpOrder.update({
      answer,
      answer_at: new Date()
    });

    return res.json({
      id,
      question,
      answer
    });
  }
}

export default new AnswerController();
