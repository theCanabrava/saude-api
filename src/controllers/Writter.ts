export default interface Writter
{
    write(content: any): Promise<string>;
}

export class Current
{
    static writter: Writter
}