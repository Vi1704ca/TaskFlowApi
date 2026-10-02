import { type Task } from './entity.js'

export interface TaskRepository{
    findAll(): Promise<Task[]>;
    findById(id:number): Promise<Task | null>;
    create(task:Task): Promise<Task>;
    update(task:Task): Promise<Task>;
    delete(task:Task): Promise<Task>
}