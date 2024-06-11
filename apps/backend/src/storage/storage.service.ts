import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class StorageService {
    constructor(
        private minioService: MinioService
    ){}

    public async uploadToS3(file: Express.Multer.File)
    {
        const names: string[] = await this.getNames()
        console.log(file.originalname)
        console.log(names)
        if(names.includes(file.originalname))
            {
                file.originalname = file.originalname + `(${(new Date).toDateString()})`
            }

        console.log(file.originalname)
        return this.minioService.client.putObject('tables', file.originalname, file.buffer)
    }

    public async uploadToS3test(files: Express.Multer.File[])
    {
        let names = []
        let etags = []
        for(const file of files)
            {
                let res = await this.uploadToS3(file)
                etags.push(res.etag)
                names.push(file.originalname)
            }
        console.log(names)
        console.log(etags)
        return this.minioService.client.getObject('tables', names[0])
    }

    public async clearBucket()
    {
        const names = await this.getNames()
        return await this.minioService.client.removeObjects('tables', names)
    }

    public async getNames()
    {
        let data = []
        const stream = await this.minioService.client.listObjects('tables')

        stream.on('data', function (obj) {
        data.push(obj)
        })
        stream.on('end', function (obj) {
        console.log(data)
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
