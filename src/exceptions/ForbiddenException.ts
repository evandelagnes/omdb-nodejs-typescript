import { Exception } from "@exceptions";

export class ForbiddenException extends Exception {
    constructor(message?: string) {
        super(403, message);
    }
}
