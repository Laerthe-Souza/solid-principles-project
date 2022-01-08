import { connectToDatabase } from '../typeorm';

async function startServices() {
  await connectToDatabase();
}

startServices();
