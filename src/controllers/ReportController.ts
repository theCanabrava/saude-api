import AppointmentModel from "../models/AppointmentModel";
import EstablishmentModel from "../models/EstablishmentModel"
import ProcedureModel from "../models/ProcedureModel";

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

    sendRepport: async (req: any, res: any) =>
    {
        const establishment = new EstablishmentModel();
        await establishment.load(req.body.establishmentId);
        let appointmentData = await AppointmentModel.getDataList(establishment.data.appointmentIds);
        if(req.body.range) appointmentData = appointmentData.filter(a => (a.date >= req.body.range[0] && a.date <= req.body.range[1]));
        for(const procedureId of req.body.procedureIds) appointmentData = appointmentData.filter(a => a.procedureId === procedureId);
        
        try
        {
            const content =
            {
                contentTemplate: 'HO_REPPORT',
                establishment,
                appointmentData
            }
            res.status(200).json({content});
        }
        catch(err)
        {
            res.status(500).json({error: err.message});
        }
    }
}

export default ReportController;