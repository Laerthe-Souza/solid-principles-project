import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export async function connectToDatabase(): Promise<Connection> {
  const connectionOptions = await getConnectionOptions();

  Object.assign(connectionOptions, {
    database:
      process.env.NODE_ENV === 'test'
        ? 'solid_principles_test'
        : 'solid_principles',
  });

  const connection = await createConnection();

  return connection;
}
