import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { MinioService } from 'nestjs-minio-client';
import { ReadStream, Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class StorageService {
    constructor(
        private minioService: MinioService
    ){}

    public async uploadToS3(file: Express.Multer.File)
    {
        const names: string[] = await this.getNames()
        console.log(file.originalname)
        if(names.includes(file.originalname))
            {
                file.originalname = file.originalname + `(${(new Date).toDateString()})`
            }

        console.log(file.originalname)
        await this.minioService.client.putObject('tables', file.originalname, file.buffer)
        return file.originalname
    }

    public async uploadToS3Buffer(file: Readable, name: string)
    {
        const names: string[] = await this.getNames()
        if(names.includes(name))
            {
                name = name + `(${(new Date).toDateString()})`
            }
            console.log(file)
        await this.minioService.client.putObject('tables', name, file)
        return name
    }

    public async uploadToS3Many(files: Express.Multer.File[])
    {
        let sentFiles = []
        let names = []
        for(const file of files)
            {
                const names: string[] = await this.getNames()
                if(names.includes(file.originalname))
                    {
                        file.originalname = file.originalname + `(${(new Date).toDateString()})`
                    }
                names.push(file.originalname)
                sentFiles.push(await this.minioService.client.putObject('tables', file.originalname, file.buffer))
            }
            return names
    }

    public async getFromS3ByName(name: string)
    {
        return await this.minioService.client.getObject('tables', name)
    }

    public async uploadToS3test(files: Express.Multer.File[])
    {
        let names = []
        let etags = []
        for(const file of files)
            {
                let res = await this.uploadToS3(file)
                names.push(res)
            }
        return this.minioService.client.getObject('tables', names[0])
    }

    public async clearBucket()
    {
        const names = await this.getNames()
        return await this.minioService.client.removeObjects('tables', names)
    }

    public async deleteObject(name: string)
    {
        return await this.minioService.client.removeObjects('tables', [name])
    }

    public async getNames()
    {
        let data = []
        const stream = await this.minioService.client.listObjects('tables')

        stream.on('data', function (obj) {
        data.push(obj)
        })
        stream.on('end', function (obj) {
        })
        stream.on('error', function (err) {
        console.log(err)
        })
        await new Promise(resolve => stream.on("end", resolve));
        let names = []
        data.forEach(element => {
            names.push(element.name)
        });
        
        return names
}
}
