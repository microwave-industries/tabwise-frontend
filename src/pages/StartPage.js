import React from "react"
import styled from 'styled-components'

import { PrimaryButton, Link } from '../components/buttons'

const Container = styled.div({
  padding: 20,
  textAlign: `center`
})

const AppName = styled.div({
  textAlign: `center`,
  fontSize: `1.8em`,
  marginBottom: 40,
  color: `#192a56`
})

const ShortcodeInput = styled.input({
  width: `100%`,
  padding: 10,
  fontSize: `1.6em`,
  boxSizing: `border-box`,
  textAlign: `center`
})

const CreateButton = styled.div({
  marginTop: 40
})

const StartPage = () => (
  <Container>
    <AppName><strong>TabWise</strong></AppName>
    <h1>👋</h1>
    <ShortcodeInput
      placeholder="shortcode"
    />
    <PrimaryButton
      to="/join"
    >
      JOIN
    </PrimaryButton>

    <CreateButton>
      <Link
        to="/new"
      >
        start a tab
      </Link>
    </CreateButton>
  </Container>
)

export default StartPage
