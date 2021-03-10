import AdministratorModel from "../models/AdministratorModel";
import EstablishmentModel from "../models/EstablishmentModel";
import ProcedureModel from "../models/ProcedureModel";
import ProfessionalModel from "../models/ProfessionalModel";

const EstablishmentController =
{
    getEstablishments: async (req: any, res: any) =>
    {
        const admin = new AdministratorModel();
        await admin.load(req.userId);
        const establishmentData = await EstablishmentModel.getSelection(admin.data.establishmentIds);
        res.status(200).json({establishments: [...establishmentData]});   
    },

    getProcedure: async (req: any, res: any) =>
    {
        const procedure = new ProcedureModel();
        await procedure.loadNamed(req.query.name);
        res.status(200).json({procedure: procedure.data});           
    },

    getProfessional: async (req: any, res: any) =>
    {
        const professional = new ProfessionalModel();
        await professional.loadNamed(req.query.name);
        res.status(200).json({professional: professional.data});            
    },

    createEstablishment: async (req: any, res: any) =>
    {
        const admin = new AdministratorModel();
        await admin.load(req.userId);

        const establishment = new EstablishmentModel();
        if(!(await establishment.addressAvailable(req.body.address)))
        {
            res.status(403).json({error: new Error('Address unavailable')});
            return;
        }
        
        try
        {
            const establishmentId = await establishment.store(
                {
                    name: req.body.name,
                    type: req.body.type,
                    address: req.body.address,
                    professionalIds: req.body.professionalIds,
                    procedureIds: req.body.procedureIds,
                    appointmentIds: []
                }
            )
            await admin.attachEstablishment(establishmentId);
            for(let id of establishment.data.professionalIds)
            {
                const professional = new ProfessionalModel();
                await professional.load(id);
                await professional.attachEstablishment(establishmentId);
            }
            res.status(201).json({establishment: establishment.data})
        }
        catch(err)
        {
            res.status(500).json({error: err.message})
        }
    },

    editProfessionals: async (req: any, res: any) =>
    {
        const admin = new AdministratorModel();
        await admin.load(req.userId);
        if(!admin.hasEstablishment(req.body.establishmentId))
        {
            res.status(403).json({error: new Error('Administrator is not responsable for establishment')});
            return;
        }

        const establishment = new EstablishmentModel();
        await establishment.load(req.body.establishmentId)
        
        try
        {
            await establishment.updateProfessionals(req.body.professionalIds)
            req.status(200).json({status: 'Updated', data: establishment.data})
        }
        catch(err)
        {
            req.status(500).json({error: err.message})
        }
    },

    editProcedures: async (req: any, res: any) =>
    {
        const admin = new AdministratorModel();
        await admin.load(req.userId);
        if(!admin.hasEstablishment(req.body.establishmentId))
        {
            res.status(403).json({error: new Error('Administrator is not responsable for establishment')});
            return;
        }

        const establishment = new EstablishmentModel();
        await establishment.load(req.body.establishmentId)
        
        try
        {
            await establishment.updateProcedures(req.body.procedureId)
            req.status(200).json({status: 'Updated', data: establishment.data})
        }
        catch(err)
        {
            req.status(500).json({error: err.message})
        }
    }
}

export default EstablishmentController;