import "dotenv/config";


export const env = {
    db_name: process.env.DB_NAME!,
    db_user: process.env.DB_USER!,
    db_host: process.env.DB_HOST!,
    db_password: process.env.DB_PASSWORD!,
    jwt_secret: process.env.JWT_SECRET!,
    jwt_expire_in: process.env.JWT_EXPIRE_IN!,
    allowed_origin: process.env.ALLOWED_ORIGIN!,
    appwrite_project_id: process.env.APPWRITE_PROJECT_ID!,
    appwrite_project_name: process.env.APPWRITE_PROJECT_NAME!,
    appwrite_endpoint: process.env.APPWRITE_ENDPOINT!,
    appwrite_api_key: process.env.APPWRITE_API_KEY!,
    appwrite_bucket_name: process.env.APPWRITE_BUCKET_ID!
};