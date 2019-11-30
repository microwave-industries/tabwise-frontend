import React from 'react'
import classnames from 'classnames'
import { PrimaryButton } from '../components/buttons'
import queryString from 'query-string'

import { Api, Timestamp } from '../lib'

import '../styles/tab.scss'

const SAMPLE_ITEMS = [
  {
    qty: 1,
    name: `Apple Strudel`,
    amount: 5
  },
  {
    qty: 1,
    name: `Banana Cheesecake`,
    amount: 12
  },
  {
    qty: `1`,
    name: `Ice Cream`,
    amount: 4
  }
]

class Tab extends React.Component {
  constructor() {
    super()
    this.state = {
      tab: null,
      error: null,
      selectedItems: []
    }
  }
  componentDidMount() {
    this.fetchTab()
  }
  fetchTab = async () => {
    const { location: { search } } = this.props
    const { shortcode } = queryString.parse(search)
    try {
      const { success, token, ...tab } = await Api.joinTab(`Huey`, shortcode)
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
  renderItem = ({ desc, price, subItems }, index) => {
    let description = [], addOns = []
    if (subItems && subItems.length > 0) {
      // determine if subitem is description (no additional charge) or add-on (with price)
      description = subItems.filter(({ lineTotal }) => lineTotal === 0).map(({ desc }) => desc)
      addOns = subItems.filter(({ lineTotal }) => lineTotal > 0)
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
            {description.length > 0 ? description.map(d =>
              <p className="item-description">
                {d}
              </p>
            ) : null}
          </div>
          <div>{price}</div>
        </div>
      </div>
    )
  }

  render() {
    const { tab, error } = this.state

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

    const { items, place, date, total: tabTotal } = tab
    const { selectedItems } = this.state

    const userShare = selectedItems.length > 0
      ? items
        .filter((v, i) => selectedItems.includes(i))
        .reduce((prev, current) => ({ lineTotal: prev.lineTotal + current.lineTotal })).lineTotal
        .toFixed(2)
      : 0
    const unaccountedFor = (tabTotal - userShare).toFixed(2)

    return (
      <div className="container">
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
          <div className="row selected-total">
            <div>Your Share</div>
            <div>{userShare}</div>
          </div>
          <div className="row unaccounted-total">
            <div>Unaccounted For</div>
            <div>{unaccountedFor}</div>
          </div>
        </div>
        <PrimaryButton
          to="/pending"
        >
          NEXT
        </PrimaryButton>
      </div>
    )
  }
}

export default Tab