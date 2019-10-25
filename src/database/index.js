import Sequelize from 'sequelize';

import databaseConfig from "../config/database";
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enrolment from '../app/models/Enrolment';
import Checkin from '../app/models/Checkin';

const models = [User, Student, Plan, Enrolment, Checkin];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
    .map(model => model.init(this.connection))
    .map(model => model.associate && model.associate(this.connection.models));
  }

}

export default new Database();
