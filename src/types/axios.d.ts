import "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }

  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
}
