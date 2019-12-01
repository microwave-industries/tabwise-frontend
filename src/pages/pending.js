import React from 'react'
import { navigate } from "gatsby"
import { CheckCircle } from 'react-feather'
import { Api } from '../lib'
import { PrimaryButton } from '../components/buttons'

import '../styles/pending.scss'

class PendingPage extends React.Component {
  constructor() {
    super()
    this.state = {
      unclaimedItems: [],
      users: []
    }
  }
  componentDidMount() {
    this.updateData()
  }
  updateData = async () => {
    try {
      const { items, users, diff, complete } = await Api.updateRoom()
      if (complete) {
        window.clearInterval(this.updater)
        navigate(`/pay`)
      }
      this.setState({
        unclaimedItems: diff.map(d => ({ ...items[d] })),
        items,
        users,
        complete
      }, () => this.updateData())
    } catch (error) {
      console.error(error)
    }
  }
  goBack = () => window.history.back()
  renderItemRow = ({ desc }, index) => {
    return (
      <div className="item-row" key={index}>
        <p>{desc}</p>
      </div>
    )
  }
  render() {
    const { unclaimedItems, users } = this.state
    if (unclaimedItems.length === 0) {
      return (
        <div className="success-screen">
          <CheckCircle size={60} color={`#192a56`} />
        </div>
      )
    }
    return (
      <div className="pending">
        <video id="waitingGif" autoplay="autoplay" loop="loop" muted>
          <source src="https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.mp4" type="video/mp4" />
        </video>
        <div className="other-users">
          {
            users.length === 1
              ? `you're the only one here`
              : users.map(({ name }) => name).join(`, `)
          }
        </div>
        <div className="unclaimed-items">
          <h1>Unclaimed Items</h1>
          {unclaimedItems.map(this.renderItemRow)}
        </div>
        <PrimaryButton onClick={this.goBack}>
          BACK
        </PrimaryButton>
      </div>
    )
  }
}

export default PendingPage