import request from '@/utils/request'

//get
export const getLight = () => {
    return request.get('/fpga/cb/getLightString')
}

export const getNixieTube = () => {
    return request.get('/fpga/cb/getNixieTubeString')
}

export const getProcessedBtn = () => {
    return request.get('/fpga/cb/getProcessedBtnStr')
}

export const getRecordedStatus = (cbIp) => {
    const params = cbIp ? {cbIp} : {}
    return request.get('/fpga/cb/getRecordedStatus?cbIp', {params})
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

export const getToken = (username, userDepartmentName) => {
    const params = {}
    if (username) {
        params.username = username
    }
    if (userDepartmentName) {
        params.userDepartmentName = userDepartmentName
    }

    return request.get('/fpga/token/generateToken', {params})
}

//post

//???????
export const checkToken = () => {
    return request.post('/fpga/token/checkToken')
}

//?????
export const reload = () => {
    return request.post('/fpga/token/reload')
}

export const inline = () => {
    return request.post('/fpga/waiting/inLine')
}

export const checkAvailability = () => {
    return request.post('/fpga/waiting/checkAvailability')
}


export const uploadBit = (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return request.post('/fpga/file/uploadBit',formData)
}

export const reloadBitFile = () => {
    return request.post('/fpga/file/reloadBitFile')
}

export const finish = () => {
    return request.post('/fpga/cb/finish')
}

export const sendButtonString = (switchButton,tapButton) => {
    const params = {}
    if (switchButton) {
        params.switchButton = switchButton
    }
    if (tapButton) {
        params.tapButton = tapButton
    }

    return request.post('/fpga/cb/sendButtonString',{},{params})
}

export const loadHistory = (tag) => {
    const params = {}
    if (tag) {
        params.tag = tag
    }

    return request.post('/fpga/cb/loadHistory',{},{params})
}

export const simulate = (verilogFile, bindFile) => {
    return request.post('/fpga/simulate',)
}