import fs from 'fs'
import config from './config.js'
import {join, extname} from 'path'
import fsPromisses from 'fs/promises'

const {dir: {
    publicDirectory
}} = config

export class Service{
    createFileStream(fileName){
       return fs.createReadStream(fileName) //Ler arquivo ao poucos e ir dispensando o que foi lido para quem chamou 
    }

    async getFileInfo(file){
        //file = home/index.js
        const fullFilePath = join(publicDirectory, file)

        await fsPromisses.access(fullFilePath)
        const fileType = extname(fullFilePath)

        return {
            type: fileType,
            name: fullFilePath
        }
    }

    async getFileStream(file){
        const {name, type} = await this.getFileInfo(file)


        return {
            stream:  this.createFileStream(name),
            type
        }
    }
}