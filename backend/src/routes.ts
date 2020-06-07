import express from 'express';
import multer from 'multer';
import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';
import multerConfig from './config/multer';
import {celebrate, Joi } from 'celebrate';


const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

//METODO CHAMA HOMEPAGE
routes.get('/',(req, res) => {
    return res.json({
        message:"HomePage"
    });

});

//CHAMA METODO LISTA ITEMS
routes.get('/items', itemsController.index);

//CHAMA METODO CRIAR POINTS E POINT_ITEMS
routes.post(
'/points',
upload.single('image'),
celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
        image: Joi.string().required(),
    })
    },{
        abortEarly: false
}),


pointsController.create);

//Home
routes.get('/points', pointsController.index);

//CHAMA METODO MOSTRA POINT POR ID COM ITEMS
routes.get('/points/:id', pointsController.show);

export default routes;

/* METODO DE LISTAGEM DE USUARIOS
routes.get('/users', (req, res) => {
    console.log('Listagem de Usuarios');

    res.json([
        'Diego',
        'Sophia'
    ]);
});

// METODO DE FILTRA USUARIO
// CONST search RECEBE A QUERY PARAM req.query
// CONST filterUsers recebe if ternario se filterUsers 
routes.get('/users',(req, res) => {
    
    const search = String(req.query.search);// String = Converte req em string

    const filterUsers = search ? users.filter(user => user.includes(search)): users; 

    return res.json(filterUsers);
});

const users = [
    'Diego',
    'Sophia',
    'Gisele'
];

//METODO DE BUSCAR USUARIO POR ID
routes.get('/users/:id',(req,res) => {
    
    const id = Number(req.params.id); //A CONST id RECEBE id DA REQUISIÇÃO PASSADO NO params // Number o paramento recebido do typescript vem com string o Number converte para Numero no id..
    
    const user = users[id]; //A CONST user RECEBE users o indice do array do id DA REQUISIÇÃO PASSADO NO params
    
    return res.json(user); // Retorna user
});

// METODO DE CRIAÇAO DE USUARIOS
routes.post('/users',(req, res) =>{
    const data = req.body;
    console.log(data);
    const users = {
        name: data.name,
        email:data.email 
    };
    return res.json(users);
});
    



// Controllers : index , show, create, update, delete


//POST: http://localhost:3030/users = Cria Usuario
//GET: http://localhost:3030/users/1 = Buscar dados do usuario com ID 1

// Request Param: PARÂMETROS QUE VEM NA PROPRIA ROTA QUE IDENTIFICA O RECURSO
// Query Param: PARÂMENTROS QUE VEM NA PROPRIA ROTA GERALMENTE OPCIONAIS PARA FILTROS, PAGINAÇAO ETC..
// Request Body: PARÂMENTROS PARA CRIAÇAO/ATUALIZAÇÃO DE DADOS.*/
