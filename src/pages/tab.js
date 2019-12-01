import React from 'react'
import { navigate } from "gatsby"
import classnames from 'classnames'
import queryString from 'query-string'

import { PrimaryButton } from '../components/buttons'
import { ErrorMessage } from '../components/typography'
import { Api, Timestamp } from '../lib'

import '../styles/tab.scss'

class Tab extends React.Component {
  constructor() {
    super()
    this.state = {
      tab: null,
      error: null,
      selectedItems: [],
      claimingItems: false,
      claimError: null
    }
  }
  componentDidMount() {
    this.fetchTab()
  }
  fetchTab = async () => {
    const { location: { search } } = this.props
    const { shortcode, name } = queryString.parse(search)
    try {
      const { success, token, ...tab } = await Api.joinTab(name, shortcode)
      this.setState({ tab })
    } catch (error) {
      this.setState({ error: `Oops, could not fetch tab` })
    }
  }
  toggleSelect = index => () => {
    const { selectedItems } = this.state
    if (selectedItems.includes(index)) {
      this.setState({
        selectedItems: selectedItems.filter(i => i !== index)
      })
    } else {
      this.setState({
        selectedItems: [...selectedItems, index]
      })
    }
  }
  claimItems = async () => {
    const { selectedItems } = this.state
    if (selectedItems.length === 0) {
      if (!window.confirm("Are you sure you want to proceed? You haven't claimed any items")) {
        return
      }
    }
    try {
      this.setState({ claimingItems: true })
      const data = await Api.claimItems(selectedItems)
      this.setState({ claimingItems: false })
      navigate(`/pending`)
    } catch (error) {
      this.setState({ claimError: `Oops, could not claim items`, claimingItems: false })
    }
  }
  renderItem = ({ desc, price, subItems, lineTotal }, index) => {
    let description = [], addOns = []
    if (subItems && subItems.length > 0) {
      // determine if subitem is description (no additional charge) or add-on (with price)
      description = subItems.filter(({ lineTotal }) => lineTotal === 0).map(({ desc }) => desc)
      // addOns = subItems.filter(({ lineTotal }) => lineTotal > 0)
    }
    return (
      <div
        className={classnames("item-row", { selected: this.state.selectedItems.includes(index) })}
        onClick={this.toggleSelect(index)}
        key={index}
      >
        <div className="item-info">
          <div>
            {desc}
            {description.length > 0 ? description.map((d, i) =>
              <p className="item-description" key={i}>
                {d}
              </p>
            ) : null}
          </div>
          <div>{price ? price.toFixed(2) : lineTotal.toFixed(2)}</div>
        </div>
      </div>
    )
  }

  render() {
    const { tab, error, claimingItems } = this.state

    if (error !== null) {
      return (
        <div className="container">
          <h1>{error}.</h1>
        </div>
      )
    }

    if (tab === null) {
      return (
        <div className="container">
          <h1>Loading...</h1>
        </div>
      )
    }

    const { items, place, date, total: tabTotal, charges } = tab
    const { selectedItems, claimError } = this.state

    const untaxedTotal = tabTotal - charges.map(x => x.amount).reduce((x, y) => x + y, 0)

    const userShare = selectedItems.length > 0
      ? items
        .filter((v, i) => selectedItems.includes(i))
        .map(i => i.lineTotal)
        .reduce((prev, current) => prev + current, 0)
      : 0
    const chargesString = charges.map(c => `${c.percentage.toFixed(2)}%`).join(`+`)
    const userTaxShare = selectedItems.length > 0
      ? Math.round(
        (
          charges
            .map(x => (Math.round(100 * x.amount * (userShare / untaxedTotal)) / 100))
            .reduce((x, y) => x + y, 0)
        ) * 100
      ) / 100 : 0
    const showCharges = userShare > 0 && charges.length > 0

    return (
      <div className="view-tab">
        <h1 id="placeName">{place}</h1>
        <h2 id="tabTime">{Timestamp.fromNow(date)}</h2>
        <div className="item-table">
          {items.map(this.renderItem)}
        </div>
        <div className="totals">
          <hr id="totals-divider" />
          <div className="row tab-total">
            <div>Tab Total</div>
            <div>{tabTotal}</div>
          </div>
          <div className="row user-total-no-tax">
            <div>Your Share{showCharges ? ` (w/o tax)` : null}</div>
            <div>{userShare.toFixed(2)}</div>
          </div >
          {
            showCharges ? (
              <>
                <div className="row user-tax">
                  <div>Taxes &amp; additional charges  (+{chargesString})</div>
                  <div className="tax">
                    {userTaxShare.toFixed(2)}
                  </div>
                </div>
                <div className="row user-total-tax">
                  <div><strong>Your Share (with tax)</strong></div>
                  <div><strong>{(userShare + userTaxShare).toFixed(2)}</strong></div>
                </div >
              </>
            ) : null
          }

        </div>
        {
          claimError ? (
            <ErrorMessage>
              {claimError}
            </ErrorMessage>
          ) : null
        }
        <PrimaryButton
          onClick={this.claimItems}
          isLoading={claimingItems}
        >
          NEXT
        </PrimaryButton>
      </div >
    )
  }
}

export default Tab