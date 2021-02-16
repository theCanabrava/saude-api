export default interface Notifier
{
    send(user: string, content: any): Promise<boolean>;
}

export class Current
{
    static notifier: Notifier
}