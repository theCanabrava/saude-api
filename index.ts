import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import LoginRouter from './src/routes/LoginRouter';
import HealthOrganizationRouter from './src/routes/HealthOrganizationRouter';
import AdministratorRouter from './src/routes/AdministratorRouter';
import ProfessionalRouter from './src/routes/ProfessionalRouter';
import PacientRouter from './src/routes/PacientRouter';

import { Current as CurrentDb } from './src/models/DBConnection';
import MongoConnection from './src/database/MongoConnection';

import { Current as CurrentW } from './src/controllers/Writter';
import PDFWritter from './src/writter/PDFWritter';

//Server set uo

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.use('/authentication', LoginRouter);
app.use('/health-organization', HealthOrganizationRouter);
app.use('/administrator', AdministratorRouter);
app.use('/professional', ProfessionalRouter)
app.use('/pacient', PacientRouter);

app.use((err, req, res, next) => 
{
    console.error(err.stack);
    res.status(500).json({err: err.message});
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
{
    console.log(`App listenning no port ${PORT}`);
})

// Database set up
CurrentDb.connection = new MongoConnection();

//Writter set up
CurrentW.writter = new PDFWritter();