 
import { AuthAdapters } from "@src/config/auth.config";
import { IBasicACLService } from "@src/core/domains/accessControl/interfaces/IACLService";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import { IUserRepository } from "@src/core/domains/auth/interfaces/repository/IUserRepository";

export interface IAuthService {
    acl(): IBasicACLService;
    boot(): Promise<void>
    getDefaultAdapter(): AuthAdapters['default']
    getJwtAdapter(): AuthAdapters['jwt']
    check(): Promise<boolean>
    user(): Promise<IUserModel | null>
    getUserRepository(): IUserRepository
}
