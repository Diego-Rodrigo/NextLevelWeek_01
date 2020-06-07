import { Request,  Response } from 'express';
import connection from '../database/connection';

//CRIAR POINTS E POINT_ITEMS
class PointsController {
    //METODO DE FILTRO POR CITY,UF, ITEMS
    async index(req: Request, res: Response){
        const { city, uf, items } = req.query;

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));
        console.log(parsedItems,items);
        
        const points = await connection('points')// chama a tabela points
        .join('points_items', 'points.id', '=', 'points_items.point_id') // se uni tb points_items recebendo points_id e points_items
        .whereIn('points_items.item_id', parsedItems )// busca todos points recebido pelo parsetItems
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');
        
        const serilazedPoints = points.map(point => {
            return{
                ...point,                
                image_url: `http://localhost:3030/uploads/${point.image}`//Endereço Mobile Ex: http://192.168.0.12:3030/uploads/....
            };
        });
    
        return res.json(serilazedPoints);
    }

    //METODO MOSTRA POINT POR ID COM ITEMS
    async show(req: Request, res: Response){
        const { id } = req.params

        const point = await connection('points').where('id', id).first();

        if(!point){

            return res.status(400).json({message: 'Point not found...'})
        }

        const serilazedPoint =  {
            
            ...point,                
            image_url: `http://localhost:3030/uploads/${point.image}`//Endereço Mobile Ex: http://192.168.0.12:3030/uploads/....
           
        };


        const items = await connection('items')
        .join('points_items', 'items.id', '=', 'points_items.item_id')
        .where('points_items.point_id', id)
        .select('items.title');
        
        return res.json({point: serilazedPoint, items});
    }

    //METODO CRIAR POINTS E POINT_ITEMS
    async create(req:Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items   
        } = req.body;
    
    const trx = await connection.transaction();    

    const point  = {
        image: req.file.filename,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    }

    const insertedIds =  await trx('points').insert(point);

    const point_id = insertedIds[0];
    
    const pointItems = items
    .split(',')
    .map((item: string) => Number(item.trim()))
    .map((item_id:number) => {
        return {
            item_id,
            point_id
        };
    })
        
    await trx('points_items').insert(pointItems)

    await trx.commit();
    
    return res.json({ 
        id: point_id,
        ...point,
     });
     } 

     
}

export default PointsController ;