import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns'

import Enrolment from '../models/Enrolment';
import Student from '../models/Student';
import Plan from '../models/Plan';


class EnrolmentController {

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
    if (!student){
      return res.status(400).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan){
      return res.status(400).json({ error: 'Plan not found' });
    }

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const price = plan.duration * plan.price;

    const enrolment = await Enrolment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price
    });

    return res.json(enrolment);
  }
}

export default new EnrolmentController();
