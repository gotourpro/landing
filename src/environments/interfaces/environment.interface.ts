export interface IEnvironment {
  production: boolean;
  ssoUri: string;
  apiUri: string;
  debounceTime: number;
  iconsUri?: string;
  uri?: string;
  gtmId: string;
  apiUriGoogle?: string;
  apiKeyGoogle?: string;
  storageUri?: string;
  baseURL?: string;
}
