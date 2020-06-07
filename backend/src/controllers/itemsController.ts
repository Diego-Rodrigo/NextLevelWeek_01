import { Request, Response} from 'express';
import connection from '../database/connection';

class ItemsController {

  //METODO LISTA ITEMS
    async index(req: Request,res: Response) { 
        const items = await connection('items').select('*');
    
        const serilazedItems = items.map(item => {
          return{
            id: item.id,
            title: item.title,
            image_url: `http://localhost:3030/uploads/${item.image}`
          };
        });
    
        return res.json(serilazedItems);
    }
}

export default ItemsController;