import { Current, DataType } from './DBConnection';

export default class AppointmentModel
{
    static async getDataList(appointmentId: string[]): Promise<AppointmentData[]>
    {
        return await Current.connection.fetchMany(DataType.APPOINTMENT, appointmentId);
    }

    static async getProfessionalSchedule(professionalId: string, date: string): Promise<AppointmentData[]>
    {
        return await Current.connection.findMany(DataType.APPOINTMENT, {professionalId, date})
    }

    data: AppointmentData =
    {
        pacientId: '',
        professionalId: '',
        establishmentId: '',
        procedureId: '',
        status:
        {
            pacientConfirmed: false,
            professionalConfirmed: false,
            establishmentConfirmed: false,
            complete: false
        },
        receipt: [],
        date: new Date(),
        time: '00:00'
    }

    load = async (id: string) =>
    {
        this.data = await Current.connection.fetchOne(DataType.APPOINTMENT, id);
        return this.data;
    }

    store = async (data: AppointmentData) =>
    {
        this.data = {...this.data, ...data };
        this.data.id = await Current.connection.write(DataType.APPOINTMENT, this.data);
        return this.data.id;
    }

    confirmProfessional = async (professionalId: string) =>
    {
        this.data.professionalId = professionalId;
        this.data.status.professionalConfirmed = true;
        return await Current.connection.write(DataType.APPOINTMENT, this.data);
    }

    confirmEstablishment = async (establishmentId: string) =>
    {
        this.data.establishmentId = establishmentId;
        this.data.status.establishmentConfirmed = true;
        return await Current.connection.write(DataType.APPOINTMENT, this.data);
    }

    finishAppointment = async (receipt: [string, number][]) =>
    {
        this.data.receipt = receipt;
        this.data.status.complete = true;
        return await Current.connection.write(DataType.APPOINTMENT, this.data);
    }
}

interface AppointmentData
{
    id?: string,
    pacientId: string,
    professionalId: string,
    establishmentId: string,
    procedureId: string,
    status:
    {
        pacientConfirmed: boolean,
        professionalConfirmed: boolean,
        establishmentConfirmed: boolean,
        complete: boolean
    },
    receipt: [string, number][],
    date: Date,
    time: string
}