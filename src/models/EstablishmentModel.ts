import { Current, DataType } from './DBConnection';

export default class EstablishmentModel
{
    static async getList(): Promise<EstablishmentData[]>
    {
        return await Current.connection.fetchBunch(DataType.ESTABLISHMENT);
    }
    
    data: EstablishmentData =
    {
        name: '',
        type: '',
        address: '',
        professionalIds: [],
        procedureIds: [],
        appointmentIds: []
    }

    load = async (id: string) =>
    {
        this.data = await Current.connection.fetchOne(DataType.ESTABLISHMENT, id);
        return this.data;
    }

    loadNamed = async (name: string) =>
    {
        this.data = await Current.connection.findOne(DataType.ESTABLISHMENT, {name});
        return this.data;
    }

    store = async (data: EstablishmentData) =>
    {
        this.data = { ...this.data, ...data };
        this.data.id = await Current.connection.write(DataType.ESTABLISHMENT, this.data);
        return this.data.id;
    }

    addressAvailable = async (address: string) => 
    {
        const id = await Current.connection.findOne(DataType.ESTABLISHMENT, {address});
        if(id) return false;
        else return true;
    };

    updateProfessionals = async (professionalIds: string[]) =>
    {
        this.data.professionalIds = professionalIds;
        this.data.id = await Current.connection.write(DataType.ESTABLISHMENT, this.data);
        return this.data.id;
    }

    updateProcedures = async (procedureIds: string[]) =>
    {
        this.data.procedureIds = procedureIds;
        this.data.id = await Current.connection.write(DataType.ESTABLISHMENT, this.data);
        return this.data.id;
    }

    attachAppointment = async (appointmentId: string) =>
    {
        this.data.appointmentIds.push(appointmentId);
        return await Current.connection.write(DataType.ESTABLISHMENT, this.data);
    }
    
}

interface EstablishmentData
{
    id?: string,
    name: string,
    type: string,
    address: string,
    professionalIds: string[],
    procedureIds: string[],
    appointmentIds: string[],
}