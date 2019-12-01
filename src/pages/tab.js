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
      claimError: null,
      quantitySelecting: null,
      quantityMax: 0,
      quantityCur: 0,
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
  openQuantitySelector = (index, qty) => () => {
    const current = this.state.selectedItems.filter(x => x == index).length;
    this.setState({
      quantitySelecting: index,
      quantityMax: qty,
      quantityCur: current
    })
  }
  selectQuantity = (quantity) => {
    const nsel = this.state.selectedItems.filter(x => x != this.state.quantitySelecting).concat(new Array(quantity).fill(this.state.quantitySelecting));
    this.setState({
      quantitySelecting: null,
      quantityMax: 0,
      quantityCur: 0,
      selectedItems: nsel
    })
  }
  cancelQuantity = () => {
    this.setState({
      quantitySelecting: null
    })
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
  renderItem = ({ qty, desc, price, subItems, lineTotal }, index) => {
    let description = [], addOns = []
    if (subItems && subItems.length > 0) {
      // determine if subitem is description (no additional charge) or add-on (with price)
      description = subItems.filter(({ lineTotal }) => lineTotal === 0).map(({ desc }) => desc)
      // addOns = subItems.filter(({ lineTotal }) => lineTotal > 0)
    }
    
    let cb = this.toggleSelect(index)
    let badge = ''
    let priceTag = price;
    if (qty > 1) {
      cb = this.openQuantitySelector(index, qty)
      const selectedCount = this.state.selectedItems.filter(x => x == index).length
      if (selectedCount > 0) {
        badge = ` (x${selectedCount})`
        priceTag = price * selectedCount;
      }
    }

    return (
      <div
        className={classnames("item-row", { selected: this.state.selectedItems.includes(index) })}
        onClick={cb}
        key={index}
      >
        <div className="item-info">
          <div>
            {desc} {badge}
            {description.length > 0 ? description.map((d, i) =>
              <p className="item-description" key={i}>
                {d}
              </p>
            ) : null}
          </div>
          <div>{priceTag ? priceTag : lineTotal}</div>
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
      ? selectedItems.map(x => items[x].price).reduce((x, y) => x + y, 0)
      : 0
    const chargesString = charges.map(c => `${c.percentage}%`).join(`+`)
    const userTaxedShare = selectedItems.length > 0
      ? Math.round(
        (
          userShare
          + charges
            .map(x => (Math.round(100 * x.amount * (userShare / untaxedTotal)) / 100))
            .reduce((x, y) => x + y, 0)
        ) * 100
      ) / 100 : 0
    const showCharges = userShare > 0 && charges.length > 0

    const {quantitySelecting, quantityMax, quantityCur} = this.state

    return (
      <div className="view-tab">
        <QuantitySelect 
          visible={quantitySelecting != null}
          maxQuantity={quantityMax}
          curQuantity={quantityCur}
          onQuantitySelect={this.selectQuantity}
          onCancel={this.cancelQuantity} />
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
            <div>
              <span style={{
                color: showCharges ? `#718093` : `#000`
              }}>
                {userShare.toFixed(2)}
              </span>
              {
                showCharges ? (
                  <div className="tax">
                    (+{chargesString}) {userTaxedShare}
                  </div>
                ) : null
              }
            </div>
          </div >
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

const QuantitySelect = ({visible, onQuantitySelect, maxQuantity, curQuantity, onCancel}) => {
  let selects = []
  for (let i = 0; i <= maxQuantity; i++) {
    selects.push(
      <div
        className={classnames('item-row', {selected: curQuantity === i})}
        onClick={() => {onQuantitySelect(i)}}>
          {i}
      </div>
    )
  }
  return (<div className={classnames("modal", {active: visible})} onClick={onCancel}>
    <div className="modal-body" onClick={(e) => e.stopPropagation()}>
      <h3>How many?</h3>
      <div className='item-table'>
        {selects}
      </div>
      <PrimaryButton onClick={onCancel}>Never mind</PrimaryButton>
    </div>
  </div>)
}

export default Tab