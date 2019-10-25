import { subDays } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';


class CheckinController {

  async index(req, res) {

    const { studentId } = req.params;

    const checkins = await Checkin.findAll(
      {
        where: { student_id: studentId },
        include: [{
          model: Student, attributes: ['name', 'email']
        }]
      });

    return res.json(checkins);
  }

  async store(req, res) {

    const { studentId } = req.params;

    const student = Student.findByPk(studentId);
    if (!student) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const dateSearch = subDays(new Date(), 7);
    const lastCheckins = await Checkin.findAll(
      {
        where: {
          student_id: studentId,
          created_at: { [Op.gte]: dateSearch }
        }
      }
    );

    if (lastCheckins && lastCheckins.length >= 5) {
      return res.status(400).json({ error: 'Number of the checkin exceed for last 7 days. Maximun 5 checkins.' })
    }

    const checkin = await Checkin.create({
      student_id: studentId
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
