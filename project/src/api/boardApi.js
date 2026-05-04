import request from '@/utils/request'

//get
export const getLight = (config = {}) => {
    return request.get('/fpga/cb/getLightString', config)
}

export const getNixieTube = (config = {}) => {
    return request.get('/fpga/cb/getNixieTubeString', config)
}

export const getProcessedBtn = (config = {}) => {
    return request.get('/fpga/cb/getProcessedBtnStr', config)
}

export const getRecordedStatus = (cbIp, config = {}) => {
    const params = cbIp ? {cbIp} : {}
    return request.get('/fpga/cb/getRecordedStatus', { ...config, params })
}

export const getSingleBoard = (id) => {
    const params = id ? {id} : {}
    return request.get('/fpga/cb/get', {params})
}

export const listActiveBoard = (current, size) => {
    const params = {}
    if (current) {
        params.current = current
    }
    if (size) {
        params.size = size
    }
    
    return request.get('/fpga/cb/listPage', {params})
}

export const getToken = (config = {}) => {
    return request.get('/fpga/token/generateToken', { ...config, withCredentials: true })
}

//post

//???????
export const checkToken = (config = {}) => {
    return request.post('/fpga/token/checkToken', {}, { ...config, withCredentials: true })
}

//?????
export const reload = (config = {}) => {
    return request.post('/fpga/token/reload', {}, { ...config, withCredentials: true })
}

export const inline = (config = {}) => {
    return request.post('/fpga/waiting/inLine', {}, config)
}

export const checkAvailability = (config = {}) => {
    return request.post('/fpga/waiting/checkAvailability', {}, config)
}


export const uploadBit = (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return request.post('/fpga/file/uploadBit',formData)
}

export const reloadBitFile = () => {
    return request.post('/fpga/file/reloadBitFile')
}

export const finish = (config = {}) => {
    return request.post('/fpga/cb/finish', {}, config)
}

export const sendButtonString = (switchButtonStatus, tapButtonStatus, config = {}) => {
    const params = {}
    if (switchButtonStatus !== undefined) {
        params.switchButtonStatus = switchButtonStatus
    }
    if (tapButtonStatus !== undefined) {
        params.tapButtonStatus = tapButtonStatus
    }

    return request.post('/fpga/cb/sendButtonString', {}, { ...config, params })
}

export const loadHistory = (tag, config = {}) => {
    const params = {}
    if (tag !== undefined) {
        params.tag = tag
    }

    return request.post('/fpga/cb/loadHistory', {}, { ...config, params })
}

export const buildExperiment = (formData) => {
    return request.post('/vboard/build',formData)
}

export const startExperiment = () => {
    return request.post('/vboard/start')
}

export const stopExperiment = () => {
    return request.post(`/vboard/finish`)
}

export const sendExpSignal = (payload) => {
    return request.post(`/vboard/signal`,payload)
}
