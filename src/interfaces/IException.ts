export interface IException {
    message: string | undefined;
    stack: string | undefined;
    status: number;

    json(): {
        status: number;
        type: string;
        message?: string;
    };
}
