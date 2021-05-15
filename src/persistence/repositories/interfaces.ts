export type Newable<T> = { new(...args: any[]): T }

export interface IRead<T> {
    get(query: any): Promise<T[]>

    getAll(): Promise<T[]>

    getById(id: string | number): Promise<T>;
}

export interface IWrite<T> {
    create(item: T): Promise<T>;

    createAll(item: T[]):Promise<T[]>;

    update(item: T, id?: string | number): Promise<boolean>;

    delete(id: string | number): Promise<boolean>;
}