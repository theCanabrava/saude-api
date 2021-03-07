import { Current, DataType } from './DBConnection';

export default class ProfessionalModel
{
    static async getList(): Promise<ProfessionalData[]>
    {
        return await Current.connection.fetchBunch(DataType.PROFESSIONAL);
    }

    static async getSpecialists(specialty: string): Promise<ProfessionalData[]>
    {
        return await Current.connection.findMany(DataType.PROFESSIONAL, {specialty});
    }

    static async getSelection(professionalIds: string[]): Promise<ProfessionalData[]>
    {
        const list = await Current.connection.fetchMany(DataType.PROFESSIONAL, professionalIds);
        return list;
    }

    data: ProfessionalData =
    {
        name: '',
        credentialId: '',
        specialty: '',
        availability:
        {
            startTime: '00:00',
            endTime: '00:00'
        },
        appointmentIds: [],
        establishmentId: ''
    }

    load = async (id: string) =>
    {
        this.data = await Current.connection.fetchOne(DataType.PROFESSIONAL, id);
        return this.data;
    }

    loadNamed = async (name: string) =>
    {
        this.data = await Current.connection.findOne(DataType.PROFESSIONAL, {name});
        return this.data;
    }

    store = async (data: ProfessionalData) =>
    {
        this.data = {...this.data, ...data };
        this.data.id = await Current.connection.write(DataType.PROFESSIONAL, this.data);
        return this.data.id;
    }

    attachEstablishment= async (establishmentId: string) =>
    {
        this.data.establishmentId = establishmentId;
        return await Current.connection.write(DataType.PROFESSIONAL, this.data);
    }

    attachAppointment = async (appointmentId: string) =>
    {
        this.data.appointmentIds.push(appointmentId);
        return await Current.connection.write(DataType.PROFESSIONAL, this.data);
    }
}

interface ProfessionalData
{
    id?: string,
    name: string,
    credentialId: string,
    specialty: string,
    availability:
    {
        startTime: string,
        endTime: string
    }
    appointmentIds: string[]
    establishmentId: string
}