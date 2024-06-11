import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class PredictionService {
    constructor(
        private storageService: StorageService
    ){}

    public async createPrediction(files: Express.Multer.File[])
    {
        const names = await this.storageService.getNames()
        for(let file of files)
        {
            if(file.originalname in names)
                {
                    file.originalname = file.originalname + Date.now()
                }
            this.storageService.uploadToS3(file)
        }
        //call to analysis python api with files data
        
        
        
        
        
        //upload tables data to Nest entities of houses

        //OR different schemes data



        //return analysis result and be ready to return houses data from tables
        

    }
}
