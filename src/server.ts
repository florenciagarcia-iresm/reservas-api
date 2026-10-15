import 'reflect-metadata';
import 'dotenv/config';
import { app } from './app';
import { AppDataSource } from './data-source';

const PORT = Number(process.env.PORT ?? 3000);

AppDataSource.initialize()
  .then(() => {
    console.log('Conectado a PostgreSQL');
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos:', err);
    process.exit(1);
  });