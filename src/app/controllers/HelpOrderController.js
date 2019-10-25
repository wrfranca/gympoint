import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {

  async index(req, res) {

    const { studentId } = req.params;

    const HelpOrders = await HelpOrder.findAll({
      where: { student_id: studentId },
      attributes: ['student_id', 'question', 'answer', 'answer_at']
    });

    return res.json(HelpOrders)
  }

  async store(req, res) {

    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question not provider.' });
    }

    const { studentId } = req.params;

    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const helpOrder = await HelpOrder.create({
      question,
      student_id: studentId
    });

    return res.json(helpOrder);
  }

}

export default new HelpOrderController();
