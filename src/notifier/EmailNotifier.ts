import Notifier from "../controllers/Notifier";
import CredentialModel from "../models/CredentialModel";

export default class EmailNotifier implements Notifier
{
    async send(user: string, content: any): Promise<boolean> 
    {
        console.log(`Should send message  ${content}`);
        return true;
    }
    
}