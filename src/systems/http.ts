import axios, { AxiosInstance } from 'axios';

interface HttpResponse<T = any> {
    data: T;
    message: string;
}

interface SeedResponse {
    seed: number;
}

export class HttpService {
    private readonly instance: AxiosInstance;
    constructor() {
        this.instance = axios.create();
    }

    async getSeed() {
        try {
            const response = await this.instance.get('http://localhost:5000/seed');
            const data = response.data;
            return data as HttpResponse<SeedResponse>;
        } catch (error) {
            console.error('error getting seed');
        }
    }
}