import express from 'express';
import AuthController from '../controllers/AuthController';
import ReportController from '../controllers/ReportController';

const HealthOrganizationRouter = express.Router();

HealthOrganizationRouter.use(AuthController.hoMiddleware);
HealthOrganizationRouter.get('/report/establishment', ReportController.getEstablishment);
HealthOrganizationRouter.get('/report/procedure', ReportController.getProcedure);
HealthOrganizationRouter.get('/report/check', ReportController.checkReport);
HealthOrganizationRouter.get('/report/generate', ReportController.sendRepport);

export default HealthOrganizationRouter;