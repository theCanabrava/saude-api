
import { Current, DataType } from './DBConnection';

export default class CredentialModel
{
    data: CredentialData =
    {
        email: '',
        permission: '',
        passwordHash: '',
        status: '',
        userId: ''
    }

    load = async (id: string) =>
    {
        this.data = await Current.connection.fetchOne(DataType.CREDENTIAL, id);
        return this.data;
    }

    loadByEmail = async(email: string) =>
    {
        this.data = await Current.connection.findOne(DataType.CREDENTIAL, {email});
        return this.data;
    }

    store = async (data: CredentialData) =>
    {
        this.data = {...this.data, ...data };
        this.data.id = await Current.connection.write(DataType.CREDENTIAL, this.data);
        return this.data.id;
    }
}

interface CredentialData
{
    id?: string,
    email: string,
    permission: string,
    passwordHash: string,
    status: string,
    userId: string
}

export const PermissionType =
{
    HEALTH_ORGANIZATION: 'healthOrganization',
    ADMINISTRATOR: 'administrator',
    PROFESSIONAL: 'professional',
    PACIENT: 'pacient'
}