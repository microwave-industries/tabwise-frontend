import React from 'react'
import { navigate } from "gatsby"
import styled from 'styled-components'

const Btn = styled.div({
  marginTop: 20,
  padding: 20,
  boxSizing: `border-box`,
  width: `100%`,
  color: `#fff`,
  backgroundColor: `#192a56`,
  cursor: `pointer`,
  textAlign: `center`,
})

class PrimaryButton extends React.Component {
  onClick = () => {
    const { to, onClick } = this.props
    if (onClick && typeof onClick === `function`) {
      onClick()
    } else {
      navigate(to)
    }
  }
  render() {
    const { children } = this.props
    return (
      <Btn onClick={this.onClick}>{children}</Btn>
    )
  }
}

export default PrimaryButton
