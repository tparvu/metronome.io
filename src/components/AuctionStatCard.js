import React, { Component } from 'react'
import { connect } from 'react-redux'
import StatCard from './StatCard'
import moment from 'moment'

class AuctionStatCard extends Component {
  state = {
    chartStatus: 'pending',
    chartError: null,
    chartData: null
  }

  // eslint-disable-next-line arrow-body-style
  retrieveData = () => {
    const { metApiUrl } = this.props.config
    const now = moment().unix()
    const from = moment().subtract({ days: 7 }).unix()

    this.setState({ chartStatus: 'pending', chartError: null, chartData: null })

    fetch(`${metApiUrl}/history?from=${from}&to=${now}`)
      .then(response => response.json())
      .then(chartData => this.setState({
        chartStatus: 'success',
        chartError: null,
        chartData: chartData.map(point => ({
          x: point.timestamp,
          y: parseInt(point.currentAuctionPrice, 10)
        }))
      }))
      .catch(err => this.setState({
        chartStatus: 'failure',
        chartError: err.message,
        chartData: null
      }))
  }

  componentDidMount () {
    this.retrieveData()
  }

  render () {
    const { currentPrice } = this.props

    return (
      <StatCard
        title="MET AUCTION"
        currentPrice={currentPrice}
        chartStatus={this.state.chartStatus}
        chartLabel="Auction Price (last 7 days)"
        chartError={this.state.chartError}
        chartData={this.state.chartData}
        onRetry={this.retrieveData}
      />
    )
  }
}

const mapStateToProps = state => ({
  currentPrice: state.auction.status.currentPrice,
  config: state.config
})

export default connect(mapStateToProps)(AuctionStatCard)
