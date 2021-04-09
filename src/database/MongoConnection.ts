import DBConnection from "../models/DBConnection";

import { MongoClient, Db, ObjectID }  from 'mongodb';

export default class MongoConnection implements DBConnection
{
    db!: Db;

    constructor() { this.connect() }

    connect = async () =>
    {
        const user = process.env.MONGO_USER;
        const password = process.env.MONGO_PASS;
        const dbName = process.env.MONGO_DB;
        const url = `mongodb+srv://${user}:${password}@cluster0-d9sst.mongodb.net/${dbName}`;
        const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
        
        try
        {
            await client.connect();
            this.db = client.db(dbName);
            console.log("Successfuly connected to mongo");
        } 
        catch (err)
        {
            throw err;
        }
    }

    async fetchOne(type: string, id: string): Promise<any> 
    {
        const found = await this.db.collection(type).find({_id: new ObjectID(id)}).toArray();
        if(found.length > 0) return this.convertToExpected(found[0]);
    }

    private convertToExpected(dbObject: any): any
    {
        dbObject.id = String(dbObject._id);
        delete dbObject._id;
        return {...dbObject}
    }

    async findOne(type: string, filter: any): Promise<any> 
    {
        const found = await this.db.collection(type).find(filter).toArray();
        if(found.length > 0) return this.convertToExpected(found[0]);
    }

    async fetchMany(type: string, ids: string[]): Promise<any> 
    {
        const objectIds = ids.map(id => new ObjectID(id));
        const found = await this.db.collection(type).find({_id: {$in: objectIds}}).toArray();
        const results = [];
        for(let object of found) results.push(this.convertToExpected(object));
        return results;
    }

    async findMany(type: string, filter: any): Promise<any> 
    {
        const found = await this.db.collection(type).find(filter).toArray();
        let results: any[] = [];
        for(let object of found)
        {
            const converted = this.convertToExpected(object);
            results = [...results, converted];
        } 
        return results;
    }

    async fetchAll(type: string): Promise<any>
    {
        const found = await this.db.collection(type).find().toArray();
        const results = [];
        for(let object of found) results.push(this.convertToExpected(object));
        return results;
    }

    async write(type: string, obj: any): Promise<string> 
    {
        if(obj.id) return await this.update(type, obj);
        else return await this.create(type, obj);
    }

    async update(type: string, obj: any): Promise<string>
    {
        const id = obj.id!;
        delete obj.id;
        await this.db.collection(type).replaceOne({_id: new ObjectID(id)}, obj);
        delete obj._id;
        return id;
    }

    async create(type: string, obj: any): Promise<string>
    {
        const result = await this.db.collection(type).insertOne(obj);
        delete obj._id;
        return result.insertedId.toString();
    }
}