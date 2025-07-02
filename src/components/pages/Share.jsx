import { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import SharePanel from '@/components/molecules/SharePanel'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { campaignService } from '@/services/api/campaignService'

const Share = () => {
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCampaigns = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await campaignService.getAll()
      setCampaigns(data)
      
      if (data.length > 0 && !selectedCampaign) {
        setSelectedCampaign(data[0])
      }
    } catch (error) {
      setError('Failed to load campaigns. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  if (isLoading) {
    return <Loading message="Loading campaigns..." />
  }

  if (error) {
    return <Error message={error} onRetry={fetchCampaigns} />
  }

  if (campaigns.length === 0) {
    return (
      <Empty
        title="No campaigns to share"
        description="Create your first merchandise campaign to start collecting preorders and sharing with your audience"
        icon="Share"
        actionLabel="Create Campaign"
        onAction={() => window.location.href = '/'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">
            Share & Promote
          </h1>
          <p className="text-gray-600 mt-1">
            Share your campaigns and track performance across different channels
          </p>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/'}
          variant="primary" 
          icon="Plus"
        >
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Campaign Selector */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold text-secondary mb-4">Select Campaign</h3>
            <div className="space-y-2">
              {campaigns.map((campaign) => (
                <button
                  key={campaign.Id}
                  onClick={() => setSelectedCampaign(campaign)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedCampaign?.Id === campaign.Id
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-secondary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ApperIcon 
                      name={campaign.productType === 'tshirt' ? 'Shirt' : 'Coffee'} 
                      size={20} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {campaign.productType === 'tshirt' ? 'T-Shirt' : 'Mug'} Design
                      </p>
                      <p className="text-xs opacity-70">
                        ${campaign.pricing}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Share Panel */}
        <div className="lg:col-span-3">
          {selectedCampaign ? (
            <SharePanel
              campaign={selectedCampaign}
              shareUrl={selectedCampaign.shareUrl || `${window.location.origin}/product/${selectedCampaign.Id}`}
            />
          ) : (
            <Card className="p-12 text-center">
              <ApperIcon name="MousePointer" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-secondary mb-2">
                Select a Campaign
              </h3>
              <p className="text-gray-600">
                Choose a campaign from the left to start sharing and promoting
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Sharing Tips */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
          <ApperIcon name="Lightbulb" size={20} className="mr-2" />
          Sharing Tips for Success
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Users" size={16} className="text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-secondary mb-1">Target Your Audience</h4>
              <p className="text-sm text-gray-600">Share with people who would be interested in your design or message</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Clock" size={16} className="text-success" />
            </div>
            <div>
              <h4 className="font-medium text-secondary mb-1">Create Urgency</h4>
              <p className="text-sm text-gray-600">Let people know this is a limited preorder opportunity</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Heart" size={16} className="text-accent" />
            </div>
            <div>
              <h4 className="font-medium text-secondary mb-1">Tell Your Story</h4>
              <p className="text-sm text-gray-600">Explain why you created this design and what it means to you</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Share