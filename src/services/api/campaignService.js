import mockCampaigns from '@/services/mockData/campaigns.json'

class CampaignService {
  constructor() {
    this.campaigns = [...mockCampaigns]
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.campaigns]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.campaigns.find(campaign => campaign.Id === id) || null
  }

  async create(campaignData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newCampaign = {
      Id: Math.max(...this.campaigns.map(c => c.Id), 0) + 1,
      ...campaignData,
      createdAt: new Date().toISOString()
    }
    
    this.campaigns.push(newCampaign)
    return { ...newCampaign }
  }

  async update(id, campaignData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.campaigns.findIndex(campaign => campaign.Id === id)
    if (index === -1) {
      throw new Error('Campaign not found')
    }
    
    this.campaigns[index] = { ...this.campaigns[index], ...campaignData }
    return { ...this.campaigns[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = this.campaigns.findIndex(campaign => campaign.Id === id)
    if (index === -1) {
      throw new Error('Campaign not found')
    }
    
    this.campaigns.splice(index, 1)
    return true
  }
}

export const campaignService = new CampaignService()