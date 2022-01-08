import 'reflect-metadata';
import 'express-async-errors';
import 'dotenv/config';

import express from 'express';

import { getErrors } from '@shared/errors/getErrors';

import { routes } from './routes';

import './startServices';
import '@shared/containers';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(getErrors);

export { app };
