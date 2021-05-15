import {IRead, IWrite, Newable} from "./interfaces";
import {Entity} from "../entities";
import {IDBClient} from "../driver/IDBClient";

export class IDBRepository<T extends Entity> implements IWrite<T>, IRead<T> {
    private readonly storeName:string;
    constructor(public repository: Newable<T> | string, public dbClient = new IDBClient()) {
        if (typeof repository === "string")
            this.storeName = repository;
        else
            this.storeName = repository.name;
    }

    async create(item: T): Promise<T> {
        const storeTransaction = await this.dbClient.storeTransaction(this.storeName, "readwrite");
        return new Promise(((resolve, reject) => {
            const request = storeTransaction.add(item);
            request.onsuccess = (e) => {
                const id = item.id ?? (e as Event & { target: { result: number } })?.target?.result;
                const newItem: T = {...item, id}
                resolve(newItem)
            };
            request.onerror = () => {
                reject(request.error);
            };
        }));
    }

    async createAll(items: T[]): Promise<T[]> {
        const created: T[] = [];
        await items.reduce(async (prevPromise: Promise<T>, next: T) => {
            await prevPromise;
            const newItem = await this.create(next);
            created.push(newItem)
            return newItem;
        }, new Promise<T>((resolve => resolve(items[0]))));
        return new Promise(resolve => resolve(created));
    }

    async delete(id: string | number): Promise<boolean> {
        const storeTransaction = await this.dbClient.storeTransaction(this.storeName, "readwrite");
        return new Promise(((resolve, reject) => {
            const request = storeTransaction.delete(id);
            request.onsuccess = () => resolve(true);
            request.onerror = () => {
                console.log(request.error);
                resolve(false);
            };
        }));
    }

    async update(item: T, id?: string | number): Promise<boolean> {
        const storeTransaction = await this.dbClient.storeTransaction(this.storeName, "readwrite");
        return new Promise(((resolve, reject) => {
            const request = storeTransaction.put(item, id);
            request.onsuccess = () => resolve(true);
            request.onerror = () => {
                console.log(request.error);
                resolve(false);
            };
        }));
    }

    async find(item: Newable<T>): Promise<T[]> {
        const storeTransaction = await this.dbClient.storeTransaction(this.storeName);
        return new Promise(((resolve, reject) => {
            const request = storeTransaction.getAll();
            request.onsuccess = () => resolve(request.result.map(this.transform));
            request.onerror = () => {
                reject(request.error)
            };
        }));
    }

    async findOne(id: string | number): Promise<T> {
        const storeTransaction = await this.dbClient.storeTransaction(this.storeName);
        return new Promise(((resolve, reject) => {
            const request = storeTransaction.get(id);
            request.onsuccess = () => resolve(this.transform(request.result) );
            request.onerror = () => {
                reject(request.error)
            };
        }));
    }

    private transform(object: T) {
        if(typeof this.repository === "string")
            return object;

        const newObj = Object.create(this.repository.prototype);
        return Object.assign(newObj, object);
    }
}