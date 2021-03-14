import AppointmentModel from "../models/AppointmentModel";
import EstablishmentModel from "../models/EstablishmentModel"
import ProcedureModel from "../models/ProcedureModel";
import ProfessionalModel from "../models/ProfessionalModel";
import { Current } from "./Writter";

const ReportController =
{
    getEstablishment: async (req: any, res: any) =>
    {
        const establishment = new EstablishmentModel();
        await establishment.loadNamed(req.query.name);
        res.status(200).json({establishment: establishment.data});           
    },

    getProcedure: async (req: any, res: any) =>
    {
        const procedure = new ProcedureModel();
        await procedure.loadNamed(req.query.name);
        res.status(200).json({procedure: procedure.data});           
    },

    checkReport: async (req: any, res: any) =>
    {
        //resgata estabelecimento
        const establishment = new EstablishmentModel();
        await establishment.load(req.query.establishmentId);
        //resgata consultas
        let appointmentData = await AppointmentModel.getDataList(establishment.data.appointmentIds);
        if(req.query.range) appointmentData = appointmentData.filter(a => (a.date >= req.query.range[0] && a.date <= req.query.range[1]));
        if(req.query.procedureIds)
        {
            let filteredAppointments: any[] = [];
            for(const procedureId of req.query.procedureIds)filteredAppointments = [...filteredAppointments, ...appointmentData.filter(a => a.procedureId === procedureId)];
            appointmentData = filteredAppointments;
        } 

        if(appointmentData.length > 0) res.status(200).json({appointmentCount: appointmentData.length});
        else res.status(404).json({error: 'Periodo selecionado não possui consultas ou exames.'});
    },

    sendRepport: async (req: any, res: any) =>
    {
        //resgata estabelecimento
        const establishment = new EstablishmentModel();
        await establishment.load(req.query.establishmentId);
        //resgata consultas
        let appointmentData = await AppointmentModel.getDataList(establishment.data.appointmentIds);
        if(req.query.range) appointmentData = appointmentData.filter(a => (a.date >= req.query.range[0] && a.date <= req.query.range[1]));
        //if(req.query.procedureIds) for(const procedureId of req.query.procedureIds) appointmentData = appointmentData.filter(a => a.procedureId === procedureId);
        if(req.query.procedureIds)
        {
            let filteredAppointments: any[] = [];
            for(const procedureId of req.query.procedureIds)filteredAppointments = [...filteredAppointments, ...appointmentData.filter(a => a.procedureId === procedureId)];
            appointmentData = filteredAppointments;
        } 
        //resgata procedimentos e profissionais
        const procedureIds: string[] = [];
        const professionalIds: string[] = []
        for(let appointment of appointmentData)
        {
            if(procedureIds.indexOf(appointment.procedureId) === -1) procedureIds.push(appointment.procedureId);
            if(professionalIds.indexOf(appointment.professionalId) === -1) professionalIds.push(appointment.professionalId);
        }
        const procedureData = await ProcedureModel.getSelection(procedureIds);
        const professionalData = await ProfessionalModel.getSelection(professionalIds);
        //constroi conteudo
        const content = ReportController.generateReportContent(req, establishment, appointmentData, procedureData, professionalData);
        //cria pdf
        await Current.writter.write(content);
        res.download('./output.pdf', 'relatorio.pdf', (err: any) => {if(err) console.log(err)});
    },

    generateReportContent: (req: any, establishment: any, appointmentData: any, procedureData: any, professionalData: any) =>
    {
        console.log(establishment.data.admissions);
        const appointments: any[] = [];
        const startDate = new Date(req.query.range[0]);
        const endDate = new Date(req.query.range[1]);
        const admissions = establishment.data.admissions.filter((a: any) => (a.date >= req.query.range[0] && a.date <= req.query.range[1]));
        const content =
        {
            establishment: 
            {
                name: establishment.data.name,
                address: establishment.data.address,
                admissions: admissions,
            },
            report:
            {
                startDate: `${startDate.getDate()}/${startDate.getMonth()+1}/${startDate.getFullYear()}`,
                endDate: `${endDate.getDate()}/${endDate.getMonth()+1}/${endDate.getFullYear()}`
            },
            appointments: appointments
        }
        for(let appointment of appointmentData)
        {
            const appointmentDate = new Date(appointment.date);
            content.appointments.push(
                {
                    id: appointment.id,
                    date:  `${appointmentDate.getDate()}/${appointmentDate.getMonth()+1}/${appointmentDate.getFullYear()}`,
                    time: appointment.time,
                    procedure: {...procedureData.find((p: any) => p.id === appointment.procedureId)},
                    professional: {name: professionalData.find((p: any) => p.id === appointment.professionalId)?.name}
                }
            )
        }
        return content;
    }
}

export default ReportController;