import express from 'express';
import AuthController from '../controllers/AuthController';
import AppointmentController from '../controllers/AppointmentController';

const ProfessionalRouter = express.Router();

ProfessionalRouter.use(AuthController.professionalMiddleware);
ProfessionalRouter.get('/schedules', AppointmentController.getAppointments);
ProfessionalRouter.put('/schedule/confirm', AppointmentController.confirmProfessional);
ProfessionalRouter.put('/schedule/finish', AppointmentController.finishAppointment);

export default ProfessionalRouter;