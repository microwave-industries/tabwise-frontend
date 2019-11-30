import React from 'react'
import { Link as GatsbyLink } from "gatsby"

class Link extends React.Component {
  render() {
    return (
      <GatsbyLink
        {...this.props}
        style={{
          color: `#273c75`,
          textDecoration: `dotted underline`,
          ...this.props.style
        }}
      />
    )
  }
}

export default Link