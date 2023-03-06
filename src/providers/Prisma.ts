import { PrismaClient } from "@prisma/client";

class Prisma {
    private _instance: PrismaClient;

    constructor() {
        this._instance = new PrismaClient();
    }

    public get instance(): PrismaClient {
        return this._instance;
    }
}

export default new Prisma().instance;
