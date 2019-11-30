import axios from 'axios'

const api = axios.create({
  baseURL: process.env.GATSBY_API_URL
})

const uploadReceipt = async (name, receiptPhoto) => {
  const formData = new FormData()
  formData.append('file', receiptPhoto)

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


export default {
  uploadReceipt,
  joinTab
}