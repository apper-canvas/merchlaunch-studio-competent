import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const SharePanel = ({ 
  campaign,
  shareUrl,
  className = '' 
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleSocialShare = (platform) => {
    const text = `Check out my custom ${campaign.productType} design! Order yours now:`
    const url = shareUrl
    
    let shareLink = ''
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'email':
        shareLink = `mailto:?subject=Check out my custom design&body=${encodeURIComponent(text + ' ' + url)}`
        break
      default:
        return
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400')
  }

  const socialPlatforms = [
    { id: 'twitter', name: 'Twitter', icon: 'Twitter', color: 'bg-blue-500' },
    { id: 'facebook', name: 'Facebook', icon: 'Facebook', color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', color: 'bg-blue-700' },
    { id: 'email', name: 'Email', icon: 'Mail', color: 'bg-gray-600' }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Share Link */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
          <ApperIcon name="Share" size={20} className="mr-2" />
          Share Your Campaign
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Campaign Link
            </label>
            <div className="flex space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 bg-gray-50"
              />
              <Button
                onClick={handleCopyLink}
                variant={copied ? 'success' : 'outline'}
                icon={copied ? 'Check' : 'Copy'}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Eye" size={16} />
            <span>Anyone with this link can view and order your product</span>
          </div>
        </div>
      </Card>

      {/* Social Media Sharing */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4">
          Share on Social Media
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {socialPlatforms.map((platform) => (
            <Button
              key={platform.id}
              onClick={() => handleSocialShare(platform.id)}
              variant="outline"
              className="justify-start"
              icon={platform.icon}
            >
              {platform.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* QR Code */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4">
          QR Code
        </h3>
        
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="QrCode" size={48} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Scan to view your campaign
          </p>
          <Button variant="outline" size="sm" icon="Download">
            Download QR Code
          </Button>
        </div>
      </Card>

      {/* Campaign Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4">
          Campaign Performance
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Page Views</span>
            <span className="font-medium">247</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Click-through Rate</span>
            <span className="font-medium text-success">12.5%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Conversion Rate</span>
            <span className="font-medium text-primary">8.2%</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SharePanel