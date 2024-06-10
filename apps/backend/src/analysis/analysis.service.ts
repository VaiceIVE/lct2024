import { Inject, Injectable } from '@nestjs/common';
import {Client} from 'minio';
import {MinioService} from 'nestjs-minio-client'
@Injectable()
export class AnalysisService {
    constructor(private minioService: MinioService){}

    public async uploadToS3(file: Express.Multer.File)
    {
        return this.minioService.client.putObject('tables', file.originalname, file.buffer)
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
