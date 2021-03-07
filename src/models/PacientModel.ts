import { Current, DataType } from './DBConnection';

export default class PacientModel
{
    static async getSelection(pacientIds: string[]): Promise<PacientData[]>
    {
        return await Current.connection.fetchMany(DataType.PACIENT, pacientIds);
    }
    
    data: PacientData =
    {
        name: '',
        credentialId: '',
        appointmentIds: [],
    }

    load = async (id: string) =>
    {
        this.data = await Current.connection.fetchOne(DataType.PACIENT, id);
        return this.data;
    }

    store = async (data: PacientData) =>
    {
        this.data = {...this.data, ...data };
        this.data.id = await Current.connection.write(DataType.PACIENT, this.data);
        return this.data.id;
    }

    attachAppointment = async (appointmentId: string) =>
    {
        this.data.appointmentIds.push(appointmentId);
        return await Current.connection.write(DataType.PACIENT, this.data);
    }
}

interface PacientData
{
    id?: string,
    name: string,
    credentialId: string,
    appointmentIds: string[]
}