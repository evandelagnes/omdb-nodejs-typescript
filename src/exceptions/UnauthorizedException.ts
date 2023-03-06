import { Exception } from "@exceptions";

export class UnauthorizedException extends Exception {
    constructor(message?: string) {
        super(401, message);
    }
}
