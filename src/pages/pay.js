import React from 'react'
import styled from 'styled-components'

import Api from '../lib/Api'
import MobileLayout from '../components/MobileLayout'
import { PrimaryButton } from '../components/buttons'
import { Link } from '../components/buttons'
import Header from '../components/header'

import '../styles/pay.scss'

const Container = styled.div({
  padding: 10,
})
class PayPage extends React.Component {
  constructor() {
    super()
    this.state = {
      url: null,
      subTotal: null,
      error: null,
      amount: null
    }
  }
  componentDidMount() {
    this.fetchPaymentLink()
  }
  fetchPaymentLink = async () => {
    try {
      const { success, url, subTotal, items, charges, amount } = await Api.getPaymentLink()
      this.setState({ url, subTotal, amount })
    } catch (error) {
      this.setState({ error: `Oops, could not fetch payment link` })
    }
  }
  payNow = () => {
    const { url } = this.state
    window.location.href = url
  }
  render() {
    const { amount, error, subTotal, url } = this.state
    if (error !== null) {
      return (
        <div className="container">
          <h1 id="h1">{error}.</h1>
        </div>
      )
    }
    if (url === null) {
      return (
        <div className="container">
          <h1 id="h1">Loading...</h1>
        </div>
      )
    }
    return (
      <MobileLayout id="view-pay">
        <div className="container">
          <h1 id="pageTitle">Payment</h1>
          <h2 className="subtitle">to: {url.split("/")[3]}</h2>
          <h3 id="amount">Amount: {subTotal.toFixed(2)}</h3>
        </div>
        <PrimaryButton
          onClick={this.payNow}
        >
          SETTLE UP
        </PrimaryButton>
      </MobileLayout>
    )
  }
}

export default PayPage