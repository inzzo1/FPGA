<script setup lang="ts">
import RealDesk from '@/components/realDesk/index.vue'
import stateHeader from '@/components/header/stateHeader.vue'
import upLoad from '@/components/upLoad.vue'
import { ElMessage } from 'element-plus'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/modules/users'
import {
  checkAvailability,
  checkToken,
  finish,
  getLight,
  getNixieTube,
  getProcessedBtn,
  getRecordedStatus,
  getToken,
  inline,
  loadHistory,
  reload,
  reloadBitFile,
  sendButtonString,
  uploadBit
} from '@/api/boardApi'

const userStore = useUserStore()
const TOKEN_RELOAD_INTERVAL_MS = 20 * 1000
const BOARD_SYNC_INTERVAL_MS = 3000

let tokenReloadTimer: number | null = null
let tokenReloading = false
let tokenPollFailedNotified = false
let boardSyncTimer: number | null = null
let boardSyncing = false
let queuePollTimer: number | null = null

const uploadingBit = ref(false)
const reloadingBit = ref(false)
const hasUploadedBit = ref(false)
const pendingBitFile = ref<File | null>(null)
const syncingSignal = ref(false)
const finishingExperiment = ref(false)
const waitingForBoard = ref(false)
const boardReady = ref(false)
const queueText = ref('')
const realDeskRef = ref<InstanceType<typeof RealDesk>>()
const ledBits = ref<number[]>(Array(32).fill(0))
const isRecorded = ref(false)
const remainText = ref('XXXXX')
const headerProgress = computed(() => (isRecorded.value ? 100 : 0))
const boardIp = ref('')

const resolveBoardTokenFromResp = (resp: any) => {
  const headerToken =
    resp?.headers?.token ||
    resp?.headers?.['x-token'] ||
    resp?.headers?.['vboard-token'] ||
    resp?.headers?.['board-token']
  return (
    resp?.data?.result?.tokenValue ||
    resp?.data?.result?.token ||
    resp?.data?.result?.tokenString ||
    resp?.data?.tokenValue ||
    resp?.data?.token ||
    headerToken ||
    resp?.data?.msg
  )
}

const ensureRealBoardToken = async ({ force = false, silent = false } = {}) => {
  if (!force && userStore.boardToken) return true
  try {
    const tokenResp = await getToken({ silent })
    const token = resolveBoardTokenFromResp(tokenResp)
    if (!token || typeof token !== 'string') {
      throw new Error('未获取到有效实验 token')
    }
    userStore.setBoardToken(token)
    return true
  } catch (err: any) {
    if (!silent) {
      ElMessage.error(err?.msg || err?.message || '实物板 token 生成失败')
    }
    return false
  }
}

const stopRealBoardTokenPolling = () => {
  if (tokenReloadTimer) {
    window.clearInterval(tokenReloadTimer)
    tokenReloadTimer = null
  }
}

const startRealBoardTokenPolling = () => {
  stopRealBoardTokenPolling()
  tokenPollFailedNotified = false
  tokenReloadTimer = window.setInterval(async () => {
    if (tokenReloading) return
    tokenReloading = true
    try {
      if (!userStore.boardToken) return

      await checkToken({ silent: true })
      // 按需求忽略 reload 返回值，仅用于刷新有效期
      await reload({ silent: true })
    } catch (err: any) {
      stopRealBoardTokenPolling()
      if (!tokenPollFailedNotified) {
        tokenPollFailedNotified = true
        ElMessage.error(
          err?.msg ||
          err?.message ||
          'token 校验/续期失败，请手动重新进入页面'
        )
      }
    } finally {
      tokenReloading = false
    }
  }, TOKEN_RELOAD_INTERVAL_MS)
}

const findBitString = (
  input: any,
  minLength = 1,
  maxLength = 64
): string | null => {
  if (typeof input === 'string') {
    const trimmed = input.trim()
    const isBits = /^[01]+$/.test(trimmed)
    if (isBits && trimmed.length >= minLength && trimmed.length <= maxLength) {
      return trimmed
    }
    return null
  }
  if (!input || typeof input !== 'object') return null
  if (Array.isArray(input)) {
    for (const item of input) {
      const found = findBitString(item, minLength, maxLength)
      if (found) return found
    }
    return null
  }
  for (const value of Object.values(input)) {
    const found = findBitString(value, minLength, maxLength)
    if (found) return found
  }
  return null
}

const findHexString = (input: any, expectedLength = 8): string | null => {
  if (typeof input === 'string') {
    const trimmed = input.trim().replace(/^0x/i, '')
    if (new RegExp(`^[0-9a-fA-F]{${expectedLength}}$`).test(trimmed)) {
      return trimmed.toUpperCase()
    }
    return null
  }
  if (!input || typeof input !== 'object') return null
  if (Array.isArray(input)) {
    for (const item of input) {
      const found = findHexString(item, expectedLength)
      if (found) return found
    }
    return null
  }
  for (const value of Object.values(input)) {
    const found = findHexString(value, expectedLength)
    if (found) return found
  }
  return null
}

const findRemainText = (input: any): string | null => {
  if (input === null || input === undefined) return null
  if (typeof input === 'number' && Number.isFinite(input)) {
    return String(input)
  }
  if (typeof input === 'string') {
    const trimmed = input.trim()
    return trimmed || null
  }
  if (typeof input !== 'object') return null

  if (Array.isArray(input)) {
    for (const item of input) {
      const found = findRemainText(item)
      if (found !== null) return found
    }
    return null
  }

  for (const [key, value] of Object.entries(input)) {
    if (/remain|left|count|time|expire/i.test(key)) {
      const found = findRemainText(value)
      if (found !== null) return found
    }
  }
  return null
}

const findBooleanValue = (input: any): boolean | null => {
  if (typeof input === 'boolean') return input
  if (typeof input === 'number') {
    if (input === 0) return false
    if (input === 1) return true
  }
  if (typeof input === 'string') {
    const normalized = input.trim().toLowerCase()
    if (['true', '1', 'yes', 'on', 'recorded', 'burned'].includes(normalized)) return true
    if (['false', '0', 'no', 'off', 'idle', 'unrecorded'].includes(normalized)) return false
  }
  if (!input || typeof input !== 'object') return null
  if (Array.isArray(input)) {
    for (const item of input) {
      const found = findBooleanValue(item)
      if (found !== null) return found
    }
    return null
  }
  for (const [key, value] of Object.entries(input)) {
    if (/record|burn|status|loaded/i.test(key)) {
      const found = findBooleanValue(value)
      if (found !== null) return found
    }
  }
  return null
}

const getUserConnectionVO = (resp: any) => {
  const result = resp?.data?.result
  if (result && typeof result === 'object' && !Array.isArray(result)) {
    return result
  }
  return null
}

const applyConnectionInfo = (connection: any) => {
  const cbIp = connection?.cbIp
  if (typeof cbIp === 'string' && cbIp.trim()) {
    boardIp.value = cbIp.trim()
    boardReady.value = true
    waitingForBoard.value = false
    queueText.value = ''
  } else {
    boardReady.value = false
  }

  const leftSecond = connection?.leftSecond
  if (leftSecond !== undefined && leftSecond !== null && String(leftSecond).trim() !== '') {
    remainText.value = String(leftSecond)
  }
}

const applyLightString = (lightString: string) => {
  const normalized = lightString.padEnd(32, '0').slice(0, 32)
  ledBits.value = Array.from({ length: 32 }, (_, number) =>
    normalized[number] === '1' ? 1 : 0
  )
}

const applyLightHexString = (hexString: string) => {
  const normalized = hexString.trim().replace(/^0x/i, '').toUpperCase()
  if (!/^[0-9A-F]{8}$/.test(normalized)) return

  // 每个十六进制字符映射四位二进制，按 LED0 -> LED31 顺序展开
  const bits = normalized
    .split('')
    .flatMap(char => Number.parseInt(char, 16).toString(2).padStart(4, '0').split(''))

  ledBits.value = bits.slice(0, 32).map(bit => (bit === '1' ? 1 : 0))
}

const syncBoardOutputs = async ({ silent = true, withNixieTube = false, lockUi = false } = {}) => {
  if (lockUi && syncingSignal.value) return
  if (lockUi) syncingSignal.value = true
  try {
    if (!boardReady.value) return
    const tokenReady = await ensureRealBoardToken({ silent })
    if (!tokenReady) return

    const requestList: Promise<any>[] = [
      getLight({ silent }),
      getProcessedBtn({ silent })
    ]

    if (withNixieTube) {
      requestList.push(getNixieTube({ silent: true }))
    }
    const [lightResp, btnResp] = await Promise.all(requestList)

    const lightHexString =
      findHexString(lightResp?.data?.result, 8) ||
      findHexString(lightResp?.data, 8)
    if (lightHexString) {
      applyLightHexString(lightHexString)
    } else {
      const lightString =
        findBitString(lightResp?.data?.result, 32, 32) ||
        findBitString(lightResp?.data, 32, 32)
      if (lightString) {
        applyLightString(lightString)
      }
    }

    const btnString =
      findBitString(btnResp?.data?.result, 6, 8) ||
      findBitString(btnResp?.data, 6, 8)
    if (btnString) {
      realDeskRef.value?.setProcessedButtonString(btnString)
    }
  } catch (err: any) {
    if (!silent) {
      ElMessage.error(err?.msg || err?.message || '同步板卡状态失败')
    }
  } finally {
    if (lockUi) syncingSignal.value = false
  }
}

const syncRecordedStatus = async ({ silent = true } = {}) => {
  try {
    if (!boardReady.value) return
    const tokenReady = await ensureRealBoardToken({ silent })
    if (!tokenReady) return
    const resp = await getRecordedStatus(boardIp.value || undefined, { silent })
    const status =
      findBooleanValue(resp?.data?.result) ??
      findBooleanValue(resp?.data?.msg)
    const remain =
      findRemainText(resp?.data?.result) ??
      findRemainText(resp?.data?.msg)
    if (status !== null) {
      isRecorded.value = status
    }
    if (remain !== null) {
      remainText.value = remain
    }
  } catch (err: any) {
    if (!silent) {
      ElMessage.error(err?.msg || err?.message || '获取烧录状态失败')
    }
  }
}

const requireBoardReady = () => {
  if (boardReady.value) return true
  ElMessage.warning(queueText.value || '正在排队中，暂未分配到板卡')
  return false
}

const handleBitUpload = async (file: File) => {
  pendingBitFile.value = file
  ElMessage.info(`已选择文件：${file.name}，点击“点击烧录”开始上传`)
}

const handleReloadBitFile = async () => {
  if (reloadingBit.value) return
  reloadingBit.value = true
  try {
    if (!requireBoardReady()) return
    const tokenReady = await ensureRealBoardToken()
    if (!tokenReady) return

    // 有新选择的文件：执行上传烧录；无新文件：执行重新烧录历史文件
    if (pendingBitFile.value) {
      uploadingBit.value = true
      const targetFile = pendingBitFile.value
      await uploadBit(targetFile)
      pendingBitFile.value = null
      hasUploadedBit.value = true
      ElMessage.success(`bit 文件上传并烧录成功：${targetFile.name}`)
    } else {
      await reloadBitFile()
      ElMessage.success(hasUploadedBit.value ? '烧录成功' : '已重新烧录上次上传文件')
    }

    isRecorded.value = true
    await syncRecordedStatus({ silent: true })
    await syncBoardOutputs({ silent: true })
  } catch (err: any) {
    ElMessage.error(err?.msg || err?.message || '烧录失败，请先上传 bit 文件')
  } finally {
    uploadingBit.value = false
    reloadingBit.value = false
  }
}

const handleDownloadSignal = async () => {
  if (syncingSignal.value) return
  try {
    if (!requireBoardReady()) return
    const tokenReady = await ensureRealBoardToken()
    if (!tokenReady) return

    const state = realDeskRef.value?.getAllStates?.()
    const switchButtonStatus = state?.switchButtonStatus || '0'.repeat(32)
    const tapButtonStatus = state?.tapButtonStatus || '0'.repeat(8)

    await sendButtonString(switchButtonStatus, tapButtonStatus)
    await syncBoardOutputs({ silent: false, lockUi: true })
    ElMessage.success('信号已下传并刷新板卡状态')
  } catch (err: any) {
    ElMessage.error(err?.msg || err?.message || '下传信号失败')
  }
}

const handleFinishExperiment = async () => {
  if (finishingExperiment.value) return
  finishingExperiment.value = true
  try {
    if (boardReady.value) {
      const tokenReady = await ensureRealBoardToken()
      if (!tokenReady) return

      await finish()
      await loadHistory(false, { silent: true })
    }

    userStore.setBoardToken('')
    hasUploadedBit.value = false
    pendingBitFile.value = null
    isRecorded.value = false
    boardReady.value = false
    waitingForBoard.value = false
    boardIp.value = ''
    queueText.value = ''
    remainText.value = 'XXXXX'
    ledBits.value = Array(32).fill(0)
    realDeskRef.value?.resetDeskStates?.()
    ElMessage.success('实验已结束')

    await ensureRealBoardToken({ force: true, silent: true })
    await enterWaitingQueue()
    if (boardReady.value) {
      await syncRecordedStatus({ silent: true })
    }
  } catch (err: any) {
    ElMessage.error(err?.msg || err?.message || '结束实验失败')
  } finally {
    finishingExperiment.value = false
  }
}

const stopQueuePolling = () => {
  if (queuePollTimer) {
    window.clearInterval(queuePollTimer)
    queuePollTimer = null
  }
}

const checkBoardAvailability = async ({ silent = true } = {}) => {
  const tokenReady = await ensureRealBoardToken({ silent })
  if (!tokenReady) return false

  const resp = await checkAvailability({ silent })
  const message = String(resp?.data?.msg || '').trim()
  const connection = getUserConnectionVO(resp)
  const hasCbIp = !!connection?.cbIp

  if (hasCbIp) {
    applyConnectionInfo(connection)
    queueText.value = ''
    waitingForBoard.value = false
    boardReady.value = true
    return true
  }

  waitingForBoard.value = true
  boardReady.value = false
  queueText.value = message || '排队中，等待空闲板卡'
  remainText.value = queueText.value
  return false
}

const startQueuePolling = () => {
  stopQueuePolling()
  queuePollTimer = window.setInterval(async () => {
    if (!waitingForBoard.value || boardReady.value) return
    try {
      const ready = await checkBoardAvailability({ silent: true })
      if (ready) {
        stopQueuePolling()
        await loadHistory(true, { silent: true }).catch(() => {})
        await syncBoardOutputs({ silent: true, withNixieTube: true })
        await syncRecordedStatus({ silent: true })
        ElMessage.success('已分配到板卡，可以开始实验')
      }
    } catch {
      // 静默轮询失败时保持等待，避免打断用户
    }
  }, 3000)
}

const enterWaitingQueue = async () => {
  const tokenReady = await ensureRealBoardToken()
  if (!tokenReady) return

  const resp = await inline()
  const message = String(resp?.data?.msg || '').trim()
  const connection = getUserConnectionVO(resp)
  const hasCbIp = !!connection?.cbIp

  if (hasCbIp) {
    applyConnectionInfo(connection)
    waitingForBoard.value = false
    boardReady.value = true
    ElMessage.success('已分配到板卡')
    return
  }

  waitingForBoard.value = true
  boardReady.value = false
  queueText.value = message || '正在排队，请稍候'
  remainText.value = queueText.value
  ElMessage.info(queueText.value)
  startQueuePolling()
}

const stopBoardSyncPolling = () => {
  if (boardSyncTimer) {
    window.clearInterval(boardSyncTimer)
    boardSyncTimer = null
  }
}

const startBoardSyncPolling = () => {
  stopBoardSyncPolling()
  boardSyncTimer = window.setInterval(async () => {
    if (
      boardSyncing ||
      syncingSignal.value ||
      uploadingBit.value ||
      reloadingBit.value ||
      finishingExperiment.value ||
      !userStore.boardToken
    ) {
      return
    }
    boardSyncing = true
    try {
      await syncBoardOutputs({ silent: true })
      await syncRecordedStatus({ silent: true })
    } finally {
      boardSyncing = false
    }
  }, BOARD_SYNC_INTERVAL_MS)
}

onMounted(async () => {
  await ensureRealBoardToken({ force: true, silent: true })
  startRealBoardTokenPolling()
  startBoardSyncPolling()
  await enterWaitingQueue()
  if (boardReady.value) {
    await loadHistory(true, { silent: true }).catch(() => {})
    await syncBoardOutputs({ silent: true, withNixieTube: true })
    await syncRecordedStatus({ silent: true })
  }
})

onBeforeUnmount(() => {
  stopRealBoardTokenPolling()
  stopBoardSyncPolling()
  stopQueuePolling()
})
</script>

<template>
  <div style="width: 100%; height: 100%" class="backGround">
    <div class="bdPart">
      <div style="width: 50%; height: 100%;overflow: hidden;">
        <div class="header">
          <stateHeader
            :burned="isRecorded"
            :remain-text="remainText"
            :progress="headerProgress"
          ></stateHeader>
        </div>
        <div class="RealDeskPart">
          <RealDesk ref="realDeskRef" :ledBits="ledBits"></RealDesk>
        </div>
      </div>
      <div style="width: 50%; height: 100%; overflow: hidden;">
        <div class="wrap">
          <div class="picture">
            <span>点击获取实拍图片</span>
          </div>
          <div class="uploadPart">
            <upLoad @uploaded="handleBitUpload"></upLoad>
          </div>
          <div class="buttonGroup">
            <el-button
              type="warning"
              round
              :loading="reloadingBit"
              :disabled="uploadingBit || finishingExperiment"
              @click="handleReloadBitFile"
            >
              点击烧录
            </el-button>
            <el-button
              type="primary"
              round
              :loading="syncingSignal"
              :disabled="uploadingBit || reloadingBit || finishingExperiment"
              @click="handleDownloadSignal"
            >
              下载信号
            </el-button>
            <el-button
              type="danger"
              round
              :loading="finishingExperiment"
              :disabled="uploadingBit || reloadingBit"
              @click="handleFinishExperiment"
            >
              结束实验
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <span>
      FPGA 远程实验平台
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .backGround{
    background-image: url('../../src/assets/bj.jpg');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    display: flex;
    align-items: flex-start;
    position: relative;
    overflow: hidden;
    .bdPart{
      width: 92%;
      height: 80%;
      margin: 0 auto;
      margin-top: 2%;
      display: flex;
      flex-wrap: nowrap;
      .header{
        width: 100%;
        height: 18.75%;
        margin: 0 auto;
        margin-top: 1%;
      }
      .RealDeskPart{
        width: 100%;
        height: 70%;
      }
      .wrap{
        width: 86%;
        height: 94%;
        margin: 0 auto;
        margin-top: 5%;
        display: flex;
        flex-wrap: wrap;
        .picture{
          width: 100%;
          height: 50%;
          background-color: rgb(196, 196, 196);
          border-radius: 30px;
          position: relative;
          cursor: pointer;
          >span{
            font-size: 30px;
            position: absolute;
            top: 42%;
            left: 30%;
          }
        }
        .uploadPart{
          width: 60%;
          height: 36%;
        }
        .buttonGroup{
          width: 40%;
          height: 34%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          button{
            width: 80%;
            height: 24%;
            font-size: 20px;
            margin: 0;
          }
        }
      }
    }
    > span{
      position: absolute;
      bottom: 10%;
      left: 5%;
      font-size: 35px;
      color: white;
    }

  }
</style>
