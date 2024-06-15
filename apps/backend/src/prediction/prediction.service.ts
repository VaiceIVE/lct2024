import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { createReadStream, createWriteStream } from 'fs';
import * as fs from 'fs';
@Injectable()
export class PredictionService {
    constructor(
        private storageService: StorageService,
        private configService: ConfigService
    ){}

    public async createPrediction(files: Express.Multer.File[])
    {
        let names = []
        for(let file of files)
        {
            names.push(this.storageService.uploadToS3(file))
        }
        
        //call to analysis python api with files data
        
        
        //let predictionStatus = axios.post(this.configService.get('PREDICTION_BACKEND_URL'), {names: names})
        let formdata = new FormData()
        for (const file of files)
            {
                fs.writeFileSync(file.originalname, file.buffer);
                formdata.append('files', createReadStream(file.originalname).read())
            }
        
        let dataLoadStatus = axios.post(this.configService.get('DATA_LOAD_URL'), {files: files})
        await dataLoadStatus
        //let predictionAnswer = await predictionStatus



        //return analysis result and be ready to return houses data from tables
        return 1

    }
}
