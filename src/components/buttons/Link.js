import React from 'react'
import { Link as GatsbyLink } from "gatsby"

class Link extends React.Component {
  render() {
    return (
      <GatsbyLink
        {...this.props}
        style={{
          textDecoration: `dotted underline`,
          ...this.props.style
        }}
      />
    )
  }
}

export default Link