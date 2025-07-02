import mockOrders from '@/services/mockData/orders.json'

class OrderService {
  constructor() {
    this.orders = [...mockOrders]
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250))
    return [...this.orders]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.orders.find(order => order.Id === id) || null
  }

  async getByCampaignId(campaignId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.orders.filter(order => order.campaignId === campaignId)
  }

  async create(orderData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newOrder = {
      Id: Math.max(...this.orders.map(o => o.Id), 0) + 1,
      ...orderData,
      timestamp: new Date().toISOString()
    }
    
    this.orders.push(newOrder)
    return { ...newOrder }
  }

  async update(id, orderData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.orders.findIndex(order => order.Id === id)
    if (index === -1) {
      throw new Error('Order not found')
    }
    
    this.orders[index] = { ...this.orders[index], ...orderData }
    return { ...this.orders[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = this.orders.findIndex(order => order.Id === id)
    if (index === -1) {
      throw new Error('Order not found')
    }
    
    this.orders.splice(index, 1)
    return true
  }
}

export const orderService = new OrderService()