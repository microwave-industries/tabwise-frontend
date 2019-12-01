import React from 'react'
import styled from 'styled-components'

import SEO from '../components/seo'
import Api from '../lib/Api'
import MobileLayout from '../components/MobileLayout'
import { PrimaryButton } from '../components/buttons'

import '../styles/pay.scss'

class PayPage extends React.Component {
  constructor() {
    super()
    this.state = {
      url: null,
      subTotal: null,
      error: null,
      amount: null,
      items: [],
      charges: []
    }
  }
  componentDidMount() {
    this.fetchPaymentLink()
  }
  fetchPaymentLink = async () => {
    try {
      const { success, url, subTotal, items, charges, amount } = await Api.getPaymentLink()
      this.setState({ url, subTotal, amount, items, charges })
    } catch (error) {
      this.setState({ error: `Oops, could not fetch payment link` })
    }
  }
  payNow = () => {
    const { url } = this.state
    window.location.href = url
  }

  renderItem = ({ qty, desc, price, subItems, lineTotal }, index) => {
    const descriptions = subItems ? subItems.filter(({ lineTotal }) => lineTotal === 0).map(({ desc }) => desc) : []
    const badge = ` (x${qty})`
    const priceTag = price * qty
    return (
      <div className="item-row" key={index}>
        <div>
          {desc} {badge}
          {descriptions.length > 0 ? descriptions.map((d, i) =>
            <p className="item-description" key={i}>
              {d}
            </p>
          ) : null}
        </div>
        <div>{priceTag ? priceTag.toFixed(2) : lineTotal.toFixed(2)}</div>
      </div>
    )
  }

  render() {
    const { amount, error, subTotal, url, items, charges } = this.state
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
    const chargesString = charges.map(c => `${c.percentage.toFixed(2)}%`).join(`+`)

    return (
      <MobileLayout id="view-pay">
        <SEO title="Settle Up" />
        <div className="container">
          <h1 id="pageTitle">
            <u>£{amount.toFixed(2)}</u> <br />to <br /><strong>{name}</strong>
          </h1>
          <div className="item-table">
            {items.map(this.renderItem)}
          </div>
          <div className="totals">
            <hr />
            <div className="row">
              <div>Your share {charges.length > 0 ? `(+${chargesString})` : null}</div>
              <div>{amount.toFixed(2)}</div>
            </div>
          </div>
          <div style={{ height: 40 }} />
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