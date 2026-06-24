import "dotenv/config"
import { Client, Storage } from "node-appwrite";


const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const storage = new Storage(client);

export { storage };