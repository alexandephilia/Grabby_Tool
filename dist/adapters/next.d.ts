type NextApiRequest = any;
type NextApiResponse = any;
type NextRequest = any;
/**
 * Grabby Sync Handler for Next.js (Pages Router)
 */
export declare function createGrabbyHandler(): (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
/**
 * Grabby Sync Handler for Next.js (App Router)
 */
export declare function createGrabbyAppHandler(): (req: NextRequest) => Promise<Response>;
export declare const POST: (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
export {};
