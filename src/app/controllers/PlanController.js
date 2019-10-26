import * as YuP from 'yup';
import Plan from '../models/Plan';

class PlanController {

  async index(req, res) {

    const pageSize = process.env.PAGE_SIZE;
    const { page = 1 } = req.query;

    const plans = await Plan.findAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['id']
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = YuP.object().shape({
      title: YuP.string().required(),
      duration: YuP.number().required(),
      price: YuP.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {

    const { id } = req.params;

    let plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan not found.' });
    }

    plan = await plan.update(req.body);

    return res.json(plan);
  }

  async delete(req, res) {

    const { id } = req.params;

    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan not found.' });
    }

    await plan.destroy()

    return res.json({ message: 'Plan removed with sucess.' });
  }

}

export default new PlanController();
