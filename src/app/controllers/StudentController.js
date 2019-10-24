import * as YuP from 'yup';

import Student from '../models/Student';

class StudentController {

  async index(req, res){

    const { page = 1 } = req.query;

    const students = await Student.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'email', 'idade', 'peso', 'altura'],
      order: ['name']
    });

    return res.json(students);
  }

  async store(req, res) {

    const schema = YuP.object().shape({
      name: YuP.string().required(),
      email: YuP.string().email().required(),
      idade: YuP.number().required(),
      // peso: YuP.number().required(),
      // altura: YuP.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    let student = await Student.findOne({ where: { email } });

    if (student) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {

    const { id } = req.params;

    let student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    student = await student.update(req.body);

    return res.json(student);
  }

}

export default new StudentController();
