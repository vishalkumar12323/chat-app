import { Client, Storage } from "node-appwrite";
import { env } from "../config/env"


const client = new Client()
    .setEndpoint(env.appwrite_endpoint)
    .setProject(env.appwrite_project_id)
    .setKey(env.appwrite_api_key);

const storage = new Storage(client);

export { storage };