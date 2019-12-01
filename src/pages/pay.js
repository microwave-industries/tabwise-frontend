import React from 'react'
import Header from '../components/header'
import styled from 'styled-components'
import { PrimaryButton } from '../components/buttons'
import Api from '../lib/Api'
import { Link } from '../components/buttons'
import { navigateTo } from 'gatsby'
import classnames from 'classnames'
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
            amount:null
        }
    }
    componentDidMount() {
        this.fetchPaymentLink();
    }
    fetchPaymentLink = async () => {
        try {
            const {success, url, subTotal, items, charges, amount} = await Api.getPaymentLink();
            console.log(amount);
            this.setState({url:url, subTotal:subTotal, amount:amount});
        } catch (error) {
            this.setState({error: `Oops, could not fetch payment link`})
        }
    }
  render() {
      const {amount, error, subTotal, url} = this.state
      if (error !== null) {
          return (
              <div className="container">
                  <h1 id="h1">{error}.</h1>
              </div>
          )
      }
      if(url === null) {
          return (
              <div className="container">
                  <h1 id="h1">Loading...</h1>
              </div>
          )
      }
    return (
        <div className="view-pay">
            <h1 id="pageTitle">Payment</h1>
            <h2 id="to">{error}</h2>
            <h2 id="to">to: {url.split("/")[3]}</h2>
            <h3 id="amount">Amount: {subTotal.toFixed(2)}</h3>
            <a id="url" href={url}>Pay using credit card</a>
        </div>
    )
  }
}

export default PayPage

/*
Pay THIS DUDE

THIS MUCH

HERE: LINK. nice icon to click andit  pay
*/


/* Generate this link
https://monzo.me/<monzoId>/<float for the amount>?d=<payerName>
e.g. https://monzo.me/leehuey/55.00?d=Bleh
*/
