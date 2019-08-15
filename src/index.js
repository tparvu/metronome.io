import ReactHintFactory from 'react-hint'
import { Provider } from 'react-redux'
import reactDOM from 'react-dom'
import React from 'react'
import 'react-hint/css/index.css'

import getInitialState from './get-initial-state'
import createStore from './create-store'
import analytics from './analytics'
import config from './config'

import MetronomeStatus from './providers/MetronomeStatus'
import WalletVersion from './providers/WalletVersion'
import WalletInfo from './providers/WalletInfo'
import Rates from './providers/Rates'

import DashboardPage from './components/dashboard/Dashboard'
import ConverterPage from './components/converter/Converter'
import ChainWarning from './components/common/ChainWarning'
import AuctionPage from './components/auction/Auction'
import WalletPage from './components/wallet/Wallet'
import HomePage from './components/home/Home'
import Marquee from './components/common/Marquee'
import Portal from './components/common/Portal'

analytics.init()

if (module.hot) {
  module.hot.accept()
}

if (config.env === 'production' && window.Raven) {
  window.Raven.config(config.sentryDns).install()
  window.addEventListener('unhandledrejection', function(e) {
    window.Raven.captureException(e.reason)
  })
}

const store = createStore(getInitialState(config))

function getAppContent(content) {
  switch (content) {
    case 'home':
      return <HomePage />
    case 'dashboard':
      return <DashboardPage />
    case 'converter':
      return <ConverterPage />
    case 'auction':
      return <AuctionPage />
    case 'wallet':
      return <WalletPage />
    default:
      return null
  }
}

const rootElement = document.getElementById('root')
const marqueeElement = document.getElementById('marquee')

if (rootElement || marqueeElement) {
  const rootContent = rootElement ? rootElement.getAttribute('content') : null
  const ReactHint = ReactHintFactory(React)

  reactDOM.render(
    <Provider store={store}>
      <React.Fragment>
        <Portal selector="#marquee">
          <Marquee />
        </Portal>
        {rootContent && getAppContent(rootContent)}
        <MetronomeStatus />
        <WalletVersion />
        <ChainWarning />
        <WalletInfo />
        <ReactHint autoPosition events />
        <Rates />
      </React.Fragment>
    </Provider>,
    rootElement
  )
}
