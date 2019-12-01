import axios from 'axios'

const api = axios.create({
  baseURL: process.env.GATSBY_API_URL,
  withCredentials: true
})

const uploadReceipt = async (receiptPhoto, paymentUrl) => {
  const formData = new FormData()
  formData.append('file', receiptPhoto)
  formData.append('paymentUrl', paymentUrl)

  try {
    const { data } = await api.post(`/receipt/upload`, formData)
    const { success, ...remainder } = data
    if (success) {
      return remainder
    } else {
      throw new Error(`Could not upload receipt: ${JSON.stringify(data)}`)
    }
  } catch (error) {
    throw error
  }
}

const joinTab = async (name, shortcode) => {
  try {
    const { data } = await api.get(`/mm/join?name=${name}&code=${shortcode}`)
    const { success, ...remainder } = data
    if (success) {
      return remainder
    } else {
      throw new Error(`Could not join tab: ${JSON.stringify(data)}`)
    }
  } catch (error) {
    throw error
  }
}

const claimItems = async (items) => { // array of indices
  try {
    const { data } = await api.post(`/claim/submit`, { items: JSON.stringify(items) })
    const { success, ...remainder } = data
    if (success) {
      return remainder
    } else {
      throw new Error(`Could not claim items: ${JSON.stringify(data)}`)
    }
  } catch (error) {
    throw error
  }
}

const updateRoom = async () => {
  try {
    const { data } = await api.get(`/mm/update`)
    const { success, ...remainder } = data
    if (success) {
      return remainder
    } else {
      throw new Error(`Could not fetch updates for room: ${JSON.stringify(data)}`)
    }
  } catch (error) {
    throw error
  }
}

const setPaymentURL = async (paymentURL) => {
  try {
    const { data } = await api.put(`/claim/details?paymentUrl=${paymentURL}`)
    return data
  } catch (error) {
    throw error
  }
}

const getPaymentLink = async () => {
  try {
    const { data } = await api.get(`/claim/pay`)
    return data
  } catch (error) {
    throw error
  }
}

export default {
  uploadReceipt,
  joinTab,
  claimItems,
  updateRoom,
  setPaymentURL,
  getPaymentLink
}