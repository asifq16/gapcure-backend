import App from '@/app';
import UsersRoute from '@/routes/patient.route';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute()]);

app.listen();
