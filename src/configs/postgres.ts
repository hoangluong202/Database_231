import { connectionString } from '@constants';
import { Pool } from 'pg';

export const postgres = new Pool({ connectionString });