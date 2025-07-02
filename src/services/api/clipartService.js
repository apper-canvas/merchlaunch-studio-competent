import clipartData from '@/services/mockData/clipart.json'

export const clipartService = {
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...clipartData])
      }, 300)
    })
  },

  async getByCategory(category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = clipartData.filter(c => c.category === category)
        resolve([...filtered])
      }, 250)
    })
  }
}