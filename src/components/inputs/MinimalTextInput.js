import React from 'react'

import './MinimalTextInput.scss'

class MinimalTextInput extends React.Component {
  render() {
    return (
      <input
        {...this.props}
        className="minimal-text-input"
      />
    )
  }
}

export default MinimalTextInput