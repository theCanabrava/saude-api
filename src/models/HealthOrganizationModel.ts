
import { Current, DataType } from './DBConnection';

export default class HealthOrganizationModel
{
    data: HealthOraganizationData =
    {
        name: '',
        credentialId: '',
    }

    load = async (id: string) =>
    {
        this.data = await Current.connection.fetchOne(DataType.HEALTH_ORGANIZATION, id);
        return this.data;
    }

    store = async (data: HealthOraganizationData) =>
    {
        this.data = {...this.data, ...data };
        this.data.id = await Current.connection.write(DataType.HEALTH_ORGANIZATION, this.data);
        return this.data.id;
    }
}

interface HealthOraganizationData
{
    id?: string,
    name: string,
    credentialId: string,
}