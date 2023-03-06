import { Exception } from "@exceptions";

export class MethodNotAllowedException extends Exception {
    constructor(message?: string) {
        super(405, message);
    }
}
