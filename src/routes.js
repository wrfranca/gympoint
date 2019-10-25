import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';
import EnrolmentController from './app/controllers/EnrolmentController';
import CheckinController from './app/controllers/CheckinController';


const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/enrolments', EnrolmentController.store);
routes.get('/enrolments', EnrolmentController.index);
routes.put('/enrolments/:id', EnrolmentController.update);
routes.delete('/enrolments/:id', EnrolmentController.delete);

routes.post('/students/:studentId/checkins/', CheckinController.store);
routes.get('/students/:studentId/checkins/', CheckinController.index);

export default routes;
