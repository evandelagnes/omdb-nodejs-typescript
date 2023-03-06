import { Exception } from "@exceptions";

export class BadRequestException extends Exception {
    constructor(message?: string) {
        super(400, message);
    }
}
