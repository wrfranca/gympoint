import jwt from 'jsonwebtoken';
import * as YuP from 'yup';

import User from "../models/User";
import authConfig from '../../config/auth';

class SessionController {

  async store(req, res) {

    // TODO: Adicionar um midware para validar os dados
    const schema = YuP.object().shape({
      email: YuP.string().email().required(),
      password: YuP.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ whre: { email } });

    if (!user) {
      res.status(401).json({ error: 'User does not authorized.' })
    }

    if (!await user.checkPassword(password)) {
      res.status(401).json({ error: 'User does not authorized.' })
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });

  }

}

export default new SessionController();
