import React from 'react'
import { navigate } from "gatsby"
import classnames from 'classnames'

import SEO from '../components/seo'
import { AvatarList } from '../components/avatars'
import MobileLayout from '../components/MobileLayout'
import { PrimaryButton } from '../components/buttons'
import { ErrorMessage } from '../components/typography'
import { Api, Timestamp } from '../lib'

import '../styles/tab.scss'

class Tab extends React.Component {
  constructor() {
    super()
    this.state = {
      token: null,
      code: null,
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
    try {
      const { success, token, code, users, ...tab } = await Api.updateRoom()
      const alreadySelected = users.filter(({ uid }) => uid === token)[0].items
      if (alreadySelected) {
        this.setState({ selectedItems: alreadySelected })
      }
      this.setState({
        tab,
        code,
        users,
        token
      })
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
    const current = this.state.selectedItems.filter(x => x === index).length;
    this.setState({
      quantitySelecting: index,
      quantityMax: qty,
      quantityCur: current
    })
  }
  selectQuantity = (quantity) => {
    const nsel = this.state.selectedItems.filter(x => x !== this.state.quantitySelecting).concat(new Array(quantity).fill(this.state.quantitySelecting));
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
      await Api.claimItems(selectedItems)
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

    const { selectedItems, users, token } = this.state

    let cb = this.toggleSelect(index)
    let badge = ''
    let priceTag = price;
    if (qty > 1) {
      cb = this.openQuantitySelector(index, qty)
      const selectedCount = selectedItems.filter(x => x === index).length
      if (selectedCount > 0) {
        badge = ` (x${selectedCount})`
        priceTag = price * selectedCount;
      }
    }

    const usersSelecting = users
      .filter(({ uid }) => uid !== token)
      .filter(({ items }) => items && items.includes(index))
      .map(({ name }) => name)

    return (
      <div
        className={classnames("item-row", { selected: selectedItems.includes(index) })}
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
            <AvatarList users={usersSelecting} style={{ marginTop: 10 }} />
          </div>
          <div>{priceTag ? priceTag.toFixed(2) : lineTotal.toFixed(2)}</div>
        </div>
      </div>
    )
  }
  render() {
    const { tab, error, claimingItems } = this.state

    if (error !== null) {
      return (
          <MobileLayout id="view-tab">
              <div className="container">
                  <h1 id="error">{error}.</h1>
                </div>
          </MobileLayout >
      )
    }

    if (tab === null) {
      return (
          <MobileLayout id="view-tab">
              <div className="container">
                  <h1 id="loading">Loading...</h1>
              </div>
          </MobileLayout >
      )
    }

    const { items, place, date, total: tabTotal, charges } = tab
    const { selectedItems, claimError } = this.state

    const untaxedTotal = tabTotal - charges.map(x => x.amount).reduce((x, y) => x + y, 0)

    const userShare = selectedItems.length > 0
      ? selectedItems.map(x => items[x].price).reduce((x, y) => x + y, 0)
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

    const { quantitySelecting, quantityMax, quantityCur } = this.state

    return (
      <MobileLayout id="view-tab">
        <SEO title="Tab" />
        <div className="container">
          <QuantitySelect
            visible={quantitySelecting != null}
            maxQuantity={quantityMax}
            curQuantity={quantityCur}
            onQuantitySelect={this.selectQuantity}
            onCancel={this.cancelQuantity} />
          <h1 id="placeName">{place}</h1>
          <h2 id="tabTime">{Timestamp.fromNow(date)}</h2>
          <h3 id="tabCode">Code: {this.state.code}</h3>
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
          <div style={{ height: 40 }} />
        </div>
        <PrimaryButton
          onClick={this.claimItems}
          isLoading={claimingItems}
        >
          NEXT
        </PrimaryButton>
      </MobileLayout >
    )
  }
}

const QuantitySelect = ({ visible, onQuantitySelect, maxQuantity, curQuantity, onCancel }) => {
  let selects = []
  for (let i = 0; i <= maxQuantity; i++) {
    selects.push(
      <div
        className={classnames('item-row', { selected: curQuantity === i })}
        onClick={() => { onQuantitySelect(i) }}
        key={i}>
        {i}
      </div>
    )
  }
  return (<div className={classnames("modal", { active: visible })} onClick={onCancel}>
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
