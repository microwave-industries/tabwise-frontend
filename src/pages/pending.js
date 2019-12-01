import React from 'react'
import { navigate } from "gatsby"
import { CheckCircle } from 'react-feather'
import SEO from '../components/seo'
import { Api } from '../lib'
import MobileLayout from '../components/MobileLayout'
import { PrimaryButton } from '../components/buttons'

import '../styles/pending.scss'

class PendingPage extends React.Component {
  constructor() {
    super()
    this.state = {
      code: null,
      unclaimedItems: [],
      users: []
    }
    this.timeout = null
  }
  componentDidMount() {
    this.updateData()
  }
  componentWillUnmount() {
    window.clearTimeout(this.timeout)
  }
  updateData = async () => {
    try {
      const { items, users, diff, complete, code } = await Api.updateRoom()
      if (complete) {
        navigate(`/pay`)
      }
      this.setState({
        code,
        unclaimedItems: diff.map(d => ({ ...items[d] })),
        items,
        users,
        complete
      }, () => {
        this.timeout = window.setTimeout(this.updateData, 500)
      })
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
    const { unclaimedItems, users, code } = this.state
    if (unclaimedItems.length === 0) {
      return (
        <MobileLayout id="success-screen">
          <CheckCircle size={60} color={`#192a56`} />
        </MobileLayout>
      )
    }
    return (
      <MobileLayout id="pending-view">
        <SEO title="Pending Tab" />
        <div className="container">
          <p id="code">Code: {code}</p>
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
          <div style={{ height: 40 }} />
        </div>
        <PrimaryButton onClick={this.goBack}>
          BACK
        </PrimaryButton>
      </MobileLayout>
    )
  }
}

export default PendingPage