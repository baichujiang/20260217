export {};
//for the docker//
declare global {
    interface Window {
        google: any;
        __API_BASE_URL__?: string;
    }
}
