import React from 'react'

class TextInput extends React.Component {
  render() {
    return (
      <input
        {...this.props}
        style={{
          width: `100%`,
          padding: 10,
          boxSizing: `border-box`,
          textAlign: `center`,
          fontWeight: 300
        }}
      />
    )
  }
}

export default TextInput