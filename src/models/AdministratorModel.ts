import { Current, DataType } from './DBConnection';

export default class AdministratorModel
{
    data: AdministratorData =
    {
        name: '',
        credentialId: '',
        establishmentIds: [],
    }

    load = async (id: string) =>
    {
        this.data = await Current.connection.fetchOne(DataType.ADMINISTRATOR, id);
        return this.data;
    }

    store = async (data: AdministratorData) =>
    {
        this.data = {...this.data, ...data };
        this.data.id = await Current.connection.write(DataType.ADMINISTRATOR, this.data);
        return this.data.id;
    }

    attachEstablishment = async (establishmentId: string) =>
    {
        this.data.establishmentIds.push(establishmentId);
        return await Current.connection.write(DataType.ADMINISTRATOR, this.data);
    }
    
    hasEstablishment = (establishmentId: string) => this.data.establishmentIds.includes(establishmentId);
}

interface AdministratorData
{
    id?: string,
    name: string,
    credentialId: string,
    establishmentIds: string[]
}