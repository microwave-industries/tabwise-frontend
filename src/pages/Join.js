import React from 'react'
import classnames from 'classnames'
import { PrimaryButton } from '../components/buttons'

import '../styles/join.scss'

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

class JoinTab extends React.Component {
  constructor() {
    super()
    this.state = {
      selectedItems: []
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
  renderItem = ({ name, amount }, index) => (
    <div
      className={classnames("item-row", { selected: this.state.selectedItems.includes(index) })}
      onClick={this.toggleSelect(index)}
    >
      <div className="item-info">
        <div>{name}</div>
        <div>£{amount}</div>
      </div>
    </div>
  )

  render() {
    const { selectedItems } = this.state
    const { tabName = `Dinner at Five Guys`, items = SAMPLE_ITEMS } = this.props

    const tabTotal = items.reduce((prev, current) => ({ amount: prev.amount + current.amount })).amount
    const userShare = selectedItems.length > 0
      ? items
        .filter((v, i) => selectedItems.includes(i))
        .reduce((prev, current) => ({ amount: prev.amount + current.amount })).amount
      : 0
    const unaccountedFor = tabTotal - userShare

    return (
      <div className="container">
        <h1>{tabName}</h1>
        <div className="item-table">
          {items.map(this.renderItem)}
        </div>
        <div className="totals">
          <hr id="totals-divider" />
          <div className="row tab-total">
            <div>Tab Total</div>
            <div>£{tabTotal}</div>
          </div>
          <div className="row selected-total">
            <div>Your Share</div>
            <div>£{userShare}</div>
          </div>
          <div className="row unaccounted-total">
            <div>Unaccounted For</div>
            <div>£{unaccountedFor}</div>
          </div>
        </div>
        <PrimaryButton
          to="pending"
        >
          NEXT
        </PrimaryButton>
      </div>
    )
  }
}

export default JoinTab