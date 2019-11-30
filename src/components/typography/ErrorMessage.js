import React from 'react'
import styled from 'styled-components'
import { AlertCircle } from 'react-feather'

const ErrorContainer = styled.div({
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `space-between`,
  alignItems: `center`,
  border: `1px solid #c0392b`,
  color: `#c0392b`,
  padding: 5,
})

const IconContainer = styled.div({

})
const MessageContainer = styled.div({
  paddingLeft: 5
})

class ErrorMessage extends React.Component {
  render() {
    const { children, style } = this.props
    return (
      <ErrorContainer style={style}>
        <IconContainer>
          <AlertCircle size={20} />
        </IconContainer>
        <MessageContainer>
          {children}
        </MessageContainer>
      </ErrorContainer>
    )
  }
}

export default ErrorMessage