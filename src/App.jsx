import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import DesignStudio from '@/components/pages/DesignStudio'
import MyCampaigns from '@/components/pages/MyCampaigns'
import Orders from '@/components/pages/Orders'
import Share from '@/components/pages/Share'
import PublicProduct from '@/components/pages/PublicProduct'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/product/:campaignId" element={<PublicProduct />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<DesignStudio />} />
            <Route path="campaigns" element={<MyCampaigns />} />
            <Route path="orders" element={<Orders />} />
            <Route path="share" element={<Share />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </Router>
  )
}

export default App