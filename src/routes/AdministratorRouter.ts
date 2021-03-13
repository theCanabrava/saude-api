import express from 'express';
import AuthController from '../controllers/AuthController';
import EstablishmentController from '../controllers/EstablishmentController';
import AppointmentController from '../controllers/AppointmentController';

const AdministratorRouter = express.Router();

AdministratorRouter.use(AuthController.adminMiddleware);
AdministratorRouter.get('/establishments', EstablishmentController.getEstablishments);
AdministratorRouter.get('/establishments/:establishmentId', EstablishmentController.getEstablishment);
AdministratorRouter.get('/establishment/procedure', EstablishmentController.getProcedure);
AdministratorRouter.get('/establishment/professional', EstablishmentController.getProfessional);
AdministratorRouter.post('/establishment/create', EstablishmentController.createEstablishment);
AdministratorRouter.put('/establishment/edit', EstablishmentController.editEstablishment);
AdministratorRouter.get('/schedules', AppointmentController.getAppointments);
AdministratorRouter.put('/schedule/confirm', AppointmentController.confirmEstablishment);

export default AdministratorRouter;