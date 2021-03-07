import CredentialModel, { PermissionType } from "../models/CredentialModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const AuthController =
{
    login: async (req: any, res: any) =>
    {
        const credentials = new CredentialModel();
        await credentials.loadByEmail(req.body.email);
        
        try
        {
            const match = await bcrypt.compare(req.body.password, credentials.data.passwordHash);
            if(match)
            {
                const token = await jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    permission: credentials.data.permission,
                    userId: credentials.data.userId
                }, 'secret');
                res.status(200).json({token});
            }
            else throw new Error('Username or password incorrect');
        }
        catch(err)
        {
            res.status(401).json({error: err.message});
        }
    },

    hoMiddleware: async (req: any, res: any, next: any) => { await AuthController.validatePermission(req, res, next, PermissionType.HEALTH_ORGANIZATION)},
    adminMiddleware: async (req: any, res: any, next: any) => { await AuthController.validatePermission(req, res, next, PermissionType.ADMINISTRATOR)},
    professionalMiddleware: async (req: any, res: any, next: any) => { await AuthController.validatePermission(req, res, next, PermissionType.PROFESSIONAL)},
    pacientMiddleware: async (req: any, res: any, next: any) => { await AuthController.validatePermission(req, res, next, PermissionType.PACIENT)},

    validatePermission: async (req: any, res: any, next: any, requiredPermission: string) =>
    {
        try
        {
            const decoded = await AuthController.validateToken(req);
            if(decoded.permission === requiredPermission)
            {
                req.userId = decoded.userId;
                req.permission = decoded.permission;
                next();
            }
            else throw new Error('Unauthorized');
        }
        catch(err)
        {
            res.status(403).json({error: err.message});
        }
    },

    validateToken: async (req: any): Promise<any> =>
    {
        const promise = new Promise((resolve, reject) =>
        {
            const token = req.headers['authorization'].split(' ')[1];
            jwt.verify(token, 'secret', (err: any, decoded: any) =>
            {
                if(err) reject(new Error('Unauthorized'));
                else resolve(decoded);
            })
        });
        return promise;
    }
}

export default AuthController;