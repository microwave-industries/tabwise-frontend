import React from 'react'
import { Link } from "gatsby"
import styled from 'styled-components'

const Btn = styled.div({
  marginTop: 20,
  padding: 20,
  boxSizing: `border-box`,
  width: `100%`,
  color: `#fff`,
  backgroundColor: `#192a56`,
  cursor: `pointer`,
})

class PrimaryButton extends React.Component {
  render() {
    const { children, to } = this.props
    return (
      <Btn>
        <Link
          to={to}
          style={{
            textDecoration: `none`,
            color: `#fff`
          }}
        >
          {children}
        </Link>
      </Btn>
    )
  }
}

export default PrimaryButton
