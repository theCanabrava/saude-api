import express from 'express';
import AuthController from '../controllers/AuthController';
import AppointmentController from '../controllers/AppointmentController';

const PacientRouter = express.Router();

PacientRouter.use(AuthController.pacientMiddleware);
PacientRouter.get('/schedules', AppointmentController.getAppointments);
PacientRouter.get('/schedule/establishments', AppointmentController.getEstablishments);
PacientRouter.get('/schedule/procedures', AppointmentController.getProcedures);
PacientRouter.get('/schedule/professionals', AppointmentController.getProfessionals);
PacientRouter.get('/schedule/availability', AppointmentController.getAvailableTime);
PacientRouter.post('/schedule/create', AppointmentController.schedule);

export default PacientRouter;