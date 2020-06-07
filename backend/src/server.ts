import express from 'express';
import cors from 'cors';
import path from 'path';
import{errors} from 'celebrate';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());// Plugin do express para corpo da requisao em JSON

app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(3030);