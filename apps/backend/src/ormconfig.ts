import { join } from "path";
import * as entities from '../src/database/entities-index';
export default 
{
    type: 'postgres',
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    entities: Object.values(entities),
    synchronize: true,
}
