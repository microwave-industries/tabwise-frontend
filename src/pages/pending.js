import React from 'react'
import queryString from 'query-string'
import { Api } from '../lib'

import '../styles/pending.scss'

class PendingPage extends React.Component {
  constructor() {
    super()
    this.state = {
      unclaimedItems: []
    }
  }
  componentDidMount() {
    this.updateData()
    // window.setInterval(this.updateData, 500)
  }
  updateData = async () => {
    try {
      const { items, users, diff } = await Api.updateRoom()
      this.setState({
        unclaimedItems: diff.map(d => ({ ...items[d] })),
        items,
        users
      })
    } catch (error) {
      console.error(error)
    }
  }
  renderItemRow = ({ desc }, index) => {
    return (
      <div className="item-row" key={index}>
        <p>{desc}</p>
      </div>
    )
  }
  render() {
    const { unclaimedItems } = this.state
    return (
      <div className="container">
        <video src="https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.mp4" id="waitingGif" />
        <div className="unclaimed-items">
          {unclaimedItems.map(this.renderItemRow)}
        </div>
      </div>
    )
  }
}

export default PendingPage