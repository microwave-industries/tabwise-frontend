import axios from 'axios'

const api = axios.create({
  baseURL: process.env.GATSBY_API_URL,
  withCredentials: true
})

const uploadReceipt = async (name, receiptPhoto) => {
  const formData = new FormData()
  formData.append('file', receiptPhoto)
  formData.append('name', name)

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
    return data
  } catch (error) {
    throw error
  }
}

export default {
  uploadReceipt,
  joinTab,
  claimItems
}