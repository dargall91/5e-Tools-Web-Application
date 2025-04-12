import { ResponseWrapper } from '@/models/ResponseWrapper';
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const requestHandler = (request: InternalAxiosRequestConfig) => request;

const responseHandler = async <T>(response: AxiosResponse<ResponseWrapper<T>>) => response;

const errorHandler = (error: AxiosError): Promise<never> => {
    if (!error.response) {
        console.log(error.toJSON());
    }

    const { data, status, config } = error.response!;

    if (status === 400) {
        if (config.method === 'get') {
            console.log(data);
        }
    } else if (status === 404) {
        if (config.method === 'get') {
            console.log(data);
        } else if (config.method === 'post') {
            console.log(data);
        }
    } else if (status === 500) {
        console.log(data);
    }

    return Promise.reject(error);
}

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 4000
});

axiosInstance.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => errorHandler(error)
);

axiosInstance.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => Promise.reject(error)
);

export default axiosInstance;