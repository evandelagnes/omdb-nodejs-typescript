import { genSalt, hash, compare } from "bcryptjs";

class Bcrypt {
    public async hash(password: string): Promise<string> {
        const salt = await genSalt(10);
        return await hash(password, salt);
    }

    public async compare(entry: string, password: string): Promise<boolean> {
        return await compare(entry, password);
    }
}

export default new Bcrypt();
