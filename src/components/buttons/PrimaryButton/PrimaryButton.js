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

const LoadingBtn = styled(Btn)({
  backgroundColor: `#273c75`,
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
    const { children, isLoading, loadingText = `Loading...` } = this.props
    if (isLoading) {
      return <LoadingBtn>{loadingText}</LoadingBtn>
    }
    return (
      <Btn onClick={this.onClick}>{children}</Btn>
    )
  }
}

export default PrimaryButton
