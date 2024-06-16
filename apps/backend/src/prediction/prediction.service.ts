import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { createReadStream, createWriteStream } from 'fs';
import * as fs from 'fs';
import { Buffer } from 'buffer';
import { default as answer } from '../static/answer.json';
@Injectable()
export class PredictionService {
    constructor(
        private storageService: StorageService,
        private configService: ConfigService
    ){}

    private async sortDict(dict)
    {

    }

    public async createPrediction(files: Express.Multer.File[])
    {
        let names = []
        for(let file of files)
        {
            names.push(this.storageService.uploadToS3(file))
        }
        
        //call to analysis python api with files data
        
        
        //let predictionStatus = axios.post(this.configService.get('PREDICTION_BACKEND_URL'), {list_of_tables: names, period: 2024})
        const FormData = require('form-data');
        let formdata = new FormData()
        for (const file of files)
            {
                fs.writeFileSync(file.originalname, file.buffer);
                formdata.append('files', file.buffer, file.originalname)
            }
        //let dataLoadStatus = await axios.post(this.configService.get('DATA_LOAD_URL'), formdata)
        //await dataLoadStatus
        //let predictionAnswer = await predictionStatus
        let tempPredictionAnswer = answer
        let objectsData = {}
        const dayProbs = tempPredictionAnswer.propability_of_anomaly
        let topProbs = []
        for (const unom of Object.keys(dayProbs))
            {
                for (const date of Object.keys(dayProbs[unom]))
                    {
                        let anomalyProbs = tempPredictionAnswer.what_anomaly_propability[unom][date]
                        var items = Object.keys(anomalyProbs).map(function(key) {
                            return [key, anomalyProbs[key]];
                        });
                        items.sort(function(first, second) {
                        return second[1] - first[1];
                        });
                        let top3Anomalies = items.slice(0, 3)
                        for (const anomaly of top3Anomalies)
                            {
                                topProbs.push({key: anomaly[0], value: anomaly[1] * dayProbs[unom][date], unom: unom, date: date})
                                //console.log(anomaly)
                            }
                    }
            }

            topProbs = topProbs.sort((a, b) => {return b.value - a.value})
        
            console.log(topProbs)
        //return analysis result and be ready to return houses data from tables
        return 1

    }
}
