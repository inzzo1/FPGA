import request from '@/utils/request'

//get
export const getLight = () => {
    return request.get('/api/fpga/cb/getLightString')
}

export const getNixieTube = () => {
    return request.get('/api/fpga/cb/getNixieTubeString')
}

export const getProcessedBtn = () => {
    return request.get('/api/fpga/cb/getProcessedBtnStr')
}

export const getRecordedStatus = (cbIp) => {
    const params = cbIp ? {cbIp} : {}
    return request.get('/api/fpga/cb/getRecordedStatus?cbIp', {params})
}

export const getSingleBoard = (id) => {
    const params = id ? {id} : {}
    return request.get('/api/fpga/cb/get', {params})
}

export const listActiveBoard = (current, size) => {
    const params = {}
    if (current) {
        params.current = current
    }
    if (size) {
        params.size = size
    }
    
    return request.get('/api/fpga/cb/listPage', {params})
}

export const getToken = (username, userDepartmentName) => {
    const params = {}
    if (username) {
        params.username = username
    }
    if (userDepartmentName) {
        params.userDepartmentName = userDepartmentName
    }

    return request.get('/api/fpga/token/generateToken', {params})
}

//post

//???????
export const checkToken = () => {
    return request.post('/api/fpga/token/checkToken')
}

//?????
export const reload = () => {
    return request.post('/api/fpga/token/reload')
}

export const inline = () => {
    return request.post('/api/fpga/waiting/inLine')
}

export const checkAvailability = () => {
    return request.post('/api/fpga/waiting/checkAvailability')
}


export const uploadBit = (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return request.post('/api/fpga/file/uploadBit',formData)
}

export const reloadBitFile = () => {
    return request.post('/api/fpga/file/reloadBitFile')
}

export const finish = () => {
    return request.post('/api/fpga/cb/finish')
}

export const sendButtonString = (switchButton,tapButton) => {
    const params = {}
    if (switchButton) {
        params.switchButton = switchButton
    }
    if (tapButton) {
        params.tapButton = tapButton
    }

    return request.post('/api/fpga/cb/sendButtonString',{},{params})
}

export const loadHistory = (tag) => {
    const params = {}
    if (tag) {
        params.tag = tag
    }

    return request.post('/api/fpga/cb/loadHistory',{},{params})
}

export const buildExperiment = (formData) => {
    return request.post('/api/vb/build',formData)
}

export const startExperiment = () => {
    return request.post('/api/vb/start')
}

export const stopExperiment = () => {
    return request.post(`/api/vb/finish`)
}

export const sendExpSignal = (payload) => {
    return request.post(`/api/vb/signal`,payload)
}