import { Current, DataType } from './DBConnection';

export default class ProcedureModel
{
    static async getList(): Promise<ProcedureData[]>
    {
        const list = await Current.connection.fetchAll(DataType.PROCEDURE);
        return list;
    }

    static async getSelection(procedureIds: string[]): Promise<ProcedureData[]>
    {
        const list = await Current.connection.fetchMany(DataType.PROCEDURE, procedureIds);
        return list;
    }

    data: ProcedureData =
    {
        name: '',
        time: '00:00',
        specialties: [],
        type: 'Consulta'
    }

    load = async (id: string) =>
    {
        this.data = await Current.connection.fetchOne(DataType.PROCEDURE, id);
        return this.data;
    }

    loadNamed = async (name: string) =>
    {
        this.data = await Current.connection.findOne(DataType.PROCEDURE, {name});
        return this.data;
    }

    store = async (data: ProcedureData) =>
    {
        this.data = {...this.data, ...data };
        this.data.id = await Current.connection.write(DataType.PROCEDURE, this.data);
        return this.data.id;
    }
}

interface ProcedureData
{
    id?: string,
    name: string,
    time: string,
    specialties: string[],
    type: string
}