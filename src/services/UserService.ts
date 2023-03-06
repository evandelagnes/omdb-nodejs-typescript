import { Prisma } from "@providers";

class UserService {
    public async create(email: string, password: string) {
        return await Prisma.user.create({
            data: {
                email,
                password,
            },
        });
    }

    public async existsByEmail(email: string) {
        return await Prisma.user.count({ where: { email } });
    }

    public async getByEmail(email: string) {
        return await Prisma.user.findUnique({
            where: { email },
        });
    }
}

export default new UserService();
