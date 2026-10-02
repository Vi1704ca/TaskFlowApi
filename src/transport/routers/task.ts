import { type Router } from 'express';

export function createTaskRouter() {
    const router = Router();

    router.get('/',  ...Router);

    router.post('/', ...Router);

    router.get('/:id',  ...Router);

    router.patch('/:id',  ...Router);

    router.get('/register',  ...Router);

    router.get('/login',  ...Router);
}