import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns'

import Enrolment from '../models/Enrolment';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/queue';
import WelcomeJob from '../job/WelcomeMail';

class EnrolmentController {

  async index(req, res) {

    const pageSize = process.env.PAGE_SIZE;
    const { page = 1 } = req.query;

    const enrolments = await Enrolment.findAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: ['id']
    });

    return res.json(enrolments);
  }

  async store(req, res) {

    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const price = plan.duration * plan.price;

    const { id } = await Enrolment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price
    });

    const enrolment = await Enrolment.findOne(
      {
        where: { id },
        include: [
          { model: Student, attributes: ['name', 'email'] },
          { model: Plan, attributes: ['title', 'duration', 'price'] }
        ]
      }
    );

    await Queue.add(WelcomeJob, { enrolment });

    // Queue.processQueue();

    return res.json(enrolment);
  }

  async update(req, res) {

    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number().positive(),
      start_date: Yup.date()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    let enrolment = await Enrolment.findByPk(req.params.id);
    if (!enrolment){
      return res.status(400).json({ error: 'Enrolment not found.' });
    }

    enrolment = await enrolment.update(req.body);

    return res.json(enrolment);
  }

  async delete(req, res) {

    const { id } = req.params;

    const enrolment = await Enrolment.findByPk(id);
    if (!enrolment) {
      return res.status(400).json({ error: 'Enrolment not found.' });
    }

    await enrolment.destroy()

    return res.json({ message: 'Enrolment removed with sucess.' });
  }
}

export default new EnrolmentController();
