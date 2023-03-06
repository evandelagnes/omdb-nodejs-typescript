import { Exception } from "@exceptions";

export class NotFoundException extends Exception {
    constructor(message?: string) {
        super(404, message);
    }
}
