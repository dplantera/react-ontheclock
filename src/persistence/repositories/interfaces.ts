export type Newable<T> = { new (...args: any[]):T}

export interface IRead<T> {
    find(item: Newable<T>): Promise<T[]>;
    findOne(id: string | number): Promise<T>;
}

export interface IWrite<T> {
    create(item: T): Promise<T>;

    update(item: T, id?: string | number): Promise<boolean>;

    delete(id: string | number): Promise<boolean>;
}