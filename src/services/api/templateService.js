import templatesData from '@/services/mockData/templates.json'

export const templateService = {
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...templatesData])
      }, 300)
    })
  },

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const template = templatesData.find(t => t.Id === parseInt(id))
        if (template) {
          resolve({ ...template })
        } else {
          reject(new Error('Template not found'))
        }
      }, 200)
    })
  },

  async getByCategory(category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = templatesData.filter(t => t.category === category)
        resolve([...filtered])
      }, 250)
    })
  }
}