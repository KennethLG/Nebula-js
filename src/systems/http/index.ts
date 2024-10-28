import config from '@/config'
import axios, { type AxiosInstance } from 'axios'

const BASE_URL = config.baseURL

interface HttpResponse<T = any> {
  data: T
  message: string
}

interface SeedResponse {
  seed: number
}

export class HttpService {
  private readonly instance: AxiosInstance
  constructor () {
    this.instance = axios.create({
      baseURL: BASE_URL
    })
  }

  async getSeed (): Promise<HttpResponse<SeedResponse> | undefined> {
    try {
      const response = await this.instance.get('/seed')
      const data = response.data
      return data as HttpResponse<SeedResponse>
    } catch (error) {
      console.error('error getting seed')
    }
  }
}
