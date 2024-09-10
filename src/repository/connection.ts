import { DataSource } from 'typeorm';
import { ApplicationStatus } from '../entity/applicationStatus';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.db',
  entities: [ApplicationStatus],
  synchronize: true,  
});

appDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });