interface Plugin {
    name: string;
    configureServer?: (server: any) => void;
}
/**
 * Grabby Sync Plugin for Vite
 * Handles POST requests to /__grabby_sync and writes element data to .grabbed_element
 */
export declare const grabbySyncPlugin: () => Plugin;
export {};
