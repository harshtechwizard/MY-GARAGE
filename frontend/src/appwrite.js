import { Client, Storage, ID } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
console.log("Appwrite Endpoint being set to:", endpoint);
console.log("Appwrite Project ID being set to:", import.meta.env.VITE_APPWRITE_PROJECT_ID);

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const storage = new Storage(client);

export { client, storage, ID };
