import express from 'express';
import AuthController from '../controllers/AuthController';
import EstablishmentController from '../controllers/EstablishmentController';
import AppointmentController from '../controllers/AppointmentController';

const AdministratorRouter = express.Router();

AdministratorRouter.use(AuthController.adminMiddleware);
AdministratorRouter.get('/establishment/procedure', EstablishmentController.getProcedure);
AdministratorRouter.get('/establishment/professional', EstablishmentController.getProfessional);
AdministratorRouter.post('/establishment/create', EstablishmentController.createEstablishment);
AdministratorRouter.put('/establishment/edit-professionals', EstablishmentController.editProfessionals);
AdministratorRouter.put('/establishment/edit-procedures', EstablishmentController.editProcedures);
AdministratorRouter.put('/appointment/confirm', AppointmentController.confirmEstablishment);

export default AdministratorRouter;