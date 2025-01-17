import {describe, expect, it, beforeEach, jest} from '@jest/globals'
import config from '../../../server/config.js'
import TestUtil from '../_util/testUtil.js'
import {handler} from '../../../server/routes.js'
import { Controller } from '../../../server/controller.js'

const {pages, location, constants: {
    CONTENT_TYPE
}} = config

describe('#Routes test site for api response', ()=>{
    beforeEach(()=>{
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    it('GET / - should redirect to home page', async ()=>{
        const params =  TestUtil.defaultHandleParams()
        params.request.method = 'GET'
        params.request.url = '/'
        await handler(...params.values())

        expect(params.response.writeHead).toHaveBeenCalledWith(302,  {
            'Location': location.home
        })
        expect(params.response.end).toHaveBeenCalled()
    })

    it(`GET /home - should response with ${pages.homeHtml} file stream`, async ()=>{
    
            const params =  TestUtil.defaultHandleParams()
            params.request.method = 'GET'
            params.request.url = '/home'
            const mockFileStream = TestUtil.generateReadableStream(['data'])

            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name,
            ).mockResolvedValue({
                stream: mockFileStream
            })
            jest.spyOn(mockFileStream, "pipe").mockReturnValue()

            await handler(...params.values())
    
            expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHtml)
            expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
        })

    it(`GET /controller - should response with ${pages.controllerHtml} file stream`,  async ()=>{
    
        const params =  TestUtil.defaultHandleParams()
        params.request.method = 'GET'
        params.request.url = '/controller'
        const mockFileStream = TestUtil.generateReadableStream(['data'])

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream
        })
        jest.spyOn(mockFileStream, "pipe").mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(pages.controllerHtml)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    })

    it(`GET /index.html - should response with file stream`, async ()=>{
    
        const params =  TestUtil.defaultHandleParams()
        const fileName = "/index.html"
        params.request.method = 'GET'
        params.request.url = fileName
        const expectedType = ".html"
        const mockFileStream = TestUtil.generateReadableStream(['data'])

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })
        jest.spyOn(mockFileStream, "pipe").mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(fileName)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
        expect(params.response.writeHead).toBeCalledWith(200, {
            'Content-Type': CONTENT_TYPE[expectedType]
        })
    })

    it(`GET /file.ext - should response with file stream`, async ()=>{
    
        const params =  TestUtil.defaultHandleParams()
        const fileName = "/index.html"
        params.request.method = 'GET'
        params.request.url = fileName
        const expectedType = ".ext"
        const mockFileStream = TestUtil.generateReadableStream(['data'])

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })
        jest.spyOn(mockFileStream, "pipe").mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(fileName)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
        expect(params.response.writeHead).not.toBeCalledWith(200, {
            'Content-Type': CONTENT_TYPE[expectedType]
        })
    })
    it(`POST /unknow - given an inexistent route it should response with 404`, async ()=>{
    
        const params =  TestUtil.defaultHandleParams()
        params.request.method = 'POST'
        params.request.url = '/unknow'

        await handler(...params.values())

        expect(params.response.writeHead).toBeCalledWith(404)
        expect(params.response.end).toBeCalled()
    })

    describe('exceptions',()=>{
        it('given inexistent file it should response with 404', async ()=>{
            const params =  TestUtil.defaultHandleParams()
            params.request.method = 'GET'
            params.request.url = '/index.png'
            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name
            ).mockRejectedValue(new Error('Error: ENOENT: no such file or directory'))
    
            await handler(...params.values())
    
            expect(params.response.writeHead).toBeCalledWith(404)
            expect(params.response.end).toBeCalled()
        })

        it('given an errorit should response with 500',  async ()=>{
            const params =  TestUtil.defaultHandleParams()
            params.request.method = 'GET'
            params.request.url = '/index.png'
            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name
            ).mockRejectedValue(new Error('Error'))
    
            await handler(...params.values())
    
            expect(params.response.writeHead).toBeCalledWith(500)
            expect(params.response.end).toBeCalled()
        })
    })
})