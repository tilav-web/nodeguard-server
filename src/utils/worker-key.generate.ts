import * as crypto from 'crypto';
export const generateWorkerKey = (): string => {
    return crypto.randomBytes(24).toString('hex');
}