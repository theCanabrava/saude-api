export default interface DBConnection
{
    fetchOne(type: string, id: string): Promise<any>;
    findOne(type: string, filter: any): Promise<any>;
    fetchMany(type: string, id: string[]): Promise<any>;
    findMany(type: string, filter: any): Promise<any>;
    fetchBunch(type: string): Promise<any>;
    write(type: string, obj: any): Promise<string>;
}

export class Current
{
    static connection: DBConnection
}

export const DataType = 
{
    CREDENTIAL: 'credential',
    
    HEALTH_ORGANIZATION: 'healthOrganization',
    ADMINISTRATOR: 'administrator',
    PROFESSIONAL: 'professional',
    PACIENT: 'pacient',
    
    ESTABLISHMENT: 'establishment',
    PROCEDURE: 'procedure',
    APPOINTMENT: 'appointment'
}