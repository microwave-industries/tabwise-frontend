import React from 'react'
import styled from 'styled-components'

import SEO from '../components/seo'
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

    const name = url.split("/")[3].replace(new RegExp(`([a-z])([A-Z][a-z])`), `$1 $2`)
    return (
      <MobileLayout id="view-pay">
        <SEO title="Settle Up" />
        <div className="container">
          <h1 id="pageTitle">
            Pay <u>£{subTotal.toFixed(2)}</u> <br />to <br /><strong>{name}</strong>
          </h1>
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