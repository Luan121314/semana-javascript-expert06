import { join, dirname } from 'path'
import {fileURLToPath} from 'url'

const cuurrentDir =dirname(fileURLToPath(import.meta.url))
const root = join(cuurrentDir, '../')
const audioDirectory = join(root, 'audio')
const publicDirectory = join(root, 'public')


export default {
    port: process.env.PORT || 3000,
    dir:{
        root,
        publicDirectory,
        audioDirectory,
        songsDirectory: join(audioDirectory, 'songs'),
        fxDirectory: join(audioDirectory, 'fx'),
    },
    pages: {
        homeHtml: 'home/index.html',
        controllerHtml: 'controller/index.html',
    },
    location: {home: '/home'},
    constants: {
        CONTENT_TYPE:{
            '.html':'text/html',
            '.css':'text/css',
            '.js':'text/javascript',
        }
    }
}