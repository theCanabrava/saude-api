import AppointmentModel from "../models/AppointmentModel";
import { PermissionType } from "../models/CredentialModel";
import EstablishmentModel from "../models/EstablishmentModel";
import PacientModel from "../models/PacientModel";
import ProcedureModel from "../models/ProcedureModel";
import ProfessionalModel from "../models/ProfessionalModel";
import { Current } from "./Notifier";

const AppointmentController =
{
    getAppointments: async (req: any, res: any) =>
    {
        let appointments = await AppointmentController.fetchAppointmentIds(req);
        const appointmentData = await AppointmentModel.getDataList(appointments);
        //resgata dados da consulta
        const establishmentIds: string[] = [];
        const pacientIds: string[] = [];
        const procedureIds: string[] = [];
        const professionalIds: string[] = [];
        for(let appointment of appointmentData)
        {
            if(establishmentIds.indexOf(appointment.establishmentId) === -1) establishmentIds.push(appointment.establishmentId);
            if(pacientIds.indexOf(appointment.pacientId) === -1) pacientIds.push(appointment.pacientId);
            if(procedureIds.indexOf(appointment.procedureId) === -1) procedureIds.push(appointment.procedureId);
            if(professionalIds.indexOf(appointment.professionalId) === -1) professionalIds.push(appointment.professionalId);
        }
        const establishmentData = await EstablishmentModel.getSelection(establishmentIds);
        const pacientData = await PacientModel.getSelection(pacientIds);
        const professionalData = await ProfessionalModel.getSelection(professionalIds);
        const procedureData = await ProcedureModel.getSelection(procedureIds);
        //infla dados da consulta
        const appointmentList: any[] = [];
        for(let appointment of appointmentData)
        {
            appointmentList.push(
                {
                    ...appointment,
                    establishment: {...establishmentData.find(e => e.id === appointment.establishmentId)},
                    pacient: {name: pacientData.find(p => p.id === appointment.pacientId)?.name},
                    professional: {...professionalData.find(p => p.id === appointment.professionalId)},
                    procedure: {...procedureData.find(p => p.id === appointment.procedureId)},
                }
            )
        }
        res.status(200).json({appointments: [...appointmentList]});
    },

    fetchAppointmentIds: async (req: any) =>
    {
        let appointments: any[];
        if(req.permission === PermissionType.PACIENT) 
        {
            const pacient = new PacientModel();
            await pacient.load(req.userId);
            appointments = pacient.data.appointmentIds;
        }
        else if(req.permission === PermissionType.PROFESSIONAL)
        {
            const professional = (new ProfessionalModel());
            await professional.load(req.userId);
            appointments = professional.data.appointmentIds;
        }
        else
        {
            const establishment = new EstablishmentModel();
            await establishment.load(req.query.establishmentId);
            appointments = establishment.data.appointmentIds;
        }
        return appointments;
    },

    getEstablishments: async (req: any, res: any) =>
    {
        const establishments = await EstablishmentModel.getList();
        res.status(200).json({establishments: [...establishments]});
    },

    getProcedures: async (req: any, res: any) =>
    {
        const establishment = new EstablishmentModel();
        await establishment.load(req.query.establishmentId);
        const procedures = await ProcedureModel.getSelection(establishment.data.procedureIds);
        res.status(200).json({procedures: [...procedures]});
    },

    getProfessionals: async (req: any, res: any) =>
    {
        const procedure = new ProcedureModel();
        await procedure.load(req.query.procedureId);

        let professionals: any[] = [];
        for(let specialty of procedure.data.specialties)
        {
            const specialists = await ProfessionalModel.getSpecialists(specialty);
            professionals = [...professionals, ...specialists];
        };
        professionals = professionals.filter((p: any) => p.establishmentId === req.query.establishmentId);
        res.status(200).json({professionals: [...professionals]});
    },
    

    schedule: async (req: any, res: any) =>
    {
        const professional = new ProfessionalModel();
        await professional.load(req.body.professionalId);

        const establishment = new EstablishmentModel();
        await establishment.load(professional.data.establishmentId);
        const pacient = new PacientModel();
        await pacient.load(req.userId);

        try
        {

            const appointment = new AppointmentModel();
            await appointment.store(
                {
                    pacientId: pacient.data.id!,
                    professionalId: professional.data.id!,
                    establishmentId: establishment.data.id!,
                    procedureId: req.body.procedureId,
                    status:
                    {
                        pacientConfirmed: true,
                        professionalConfirmed: false,
                        establishmentConfirmed: false,
                        complete: false
                    },
                    receipt: [],
                    date: req.body.date,
                    time: req.body.time
                }
            )
            await pacient.attachAppointment(appointment.data.id!)            
            await professional.attachAppointment(appointment.data.id!);
            await establishment.attachAppointment(appointment.data.id!);
            res.status(201).json({appointment: appointment.data});
        }
        catch(err)
        {
            res.status(500).json({error: err.message});
        }
    },

    confirmProfessional: async (req: any, res: any) =>
    {
        try
        {
            const professional = new ProfessionalModel();
            await professional.load(req.userId);
            const appointment = new AppointmentModel();
            await appointment.load(req.body.appointmentId);
            await appointment.confirmProfessional(professional.data.id!);

            //await AppointmentController.notifyPatient(appointment);
            res.status(200).json({appointment: appointment.data});
        }
        catch(err)
        {
            console.log(err);
            res.status(500).json({error: err.message});
        }
    },

    confirmEstablishment: async (req: any, res: any) =>
    {
        try
        {
            const establishment = new EstablishmentModel();
            await establishment.load(req.body.establishmentId);
            const appointment = new AppointmentModel();
            await appointment.load(req.body.appointmentId);
            await appointment.confirmEstablishment(establishment.data.id!);

            //await AppointmentController.notifyPatient(appointment);
            res.status(200).json({appointment: appointment.data});
        }
        catch(err)
        {
            res.status(500).json({error: err.message});
        }
    },

    notifyPatient: async (appointment: AppointmentModel) =>
    {
        if(appointment.data.status.professionalConfirmed && appointment.data.status.establishmentConfirmed)
        {
            const content =
            {
                contentTemplate: 'APPOINTMENT_CONFIRMED',
                appointment: appointment
            }
            await Current.notifier.send(appointment.data.pacientId, content);
        }
    }
}

export default AppointmentController;