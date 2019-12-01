import React from "react"
import styled from 'styled-components'
import SEO from '../components/seo'

import { PrimaryButton, Link } from '../components/buttons'
import { TextInput } from '../components/inputs'
import { ErrorMessage } from '../components/typography'
import { Api } from '../lib/'


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

const CreateButton = styled.div({
  marginTop: 40
})

const cleanShortcode = shortcode => {
  // if (shortcode.indexOf(`-`) !== `-1`) {
  //   return shortcode.split(`-`).join(``).toLowerCase()
  // } else if (shortcode.indexOf(` `) !== `-1`) {
  //   return shortcode.split(` `).join(``).toLowerCase()
  // }
  return shortcode.toLowerCase()
}

class StartPage extends React.Component {
  constructor() {
    super()
    this.state = {
      shortcode: ``,
      userName: ``,
      isJoining: false,
      error: null
    }
  }
  onChange = key => ({ target: { value } }) => this.setState({ [key]: value })
  joinTab = async () => {
    const { shortcode, userName } = this.state
    const cleanCode = cleanShortcode(shortcode)

    if (shortcode.length === 0 || userName.length === 0) {
      return this.setState({ error: `Please enter both your name and a shortcode` })
    }

    try {
      this.setState({ isJoining: true })
      const data = await Api.joinTab(userName, cleanCode)
      window.location.href = `/tab?shortcode=${cleanCode}&name=${userName}`
    } catch (error) {
      console.log(error)
      this.setState({ isJoining: false, error: `Could not join room` })
    }
  }
  render() {
    const { shortcode, userName, isJoining, error } = this.state
    const cleanCode = cleanShortcode(shortcode)
    return (
      <Container>
        <SEO title="Welcome" />
        <AppName><strong>TabWise</strong></AppName>
        <h1><span role="img" aria-label="hello">👋</span></h1>
        <TextInput
          placeholder="shortcode"
          value={shortcode}
          onChange={this.onChange(`shortcode`)}
          style={{ fontSize: `1.6em`, marginBottom: 10 }}
        />
        <TextInput
          placeholder="your name"
          value={userName}
          onChange={this.onChange(`userName`)}
          style={{ fontSize: `1.6em` }}
        />
        {
          error ? (
            <ErrorMessage style={{ marginTop: 20 }}>
              {error}
            </ErrorMessage>
          ) : null
        }
        <PrimaryButton
          onClick={this.joinTab}
          isLoading={isJoining}
          loadingText="JOINING..."
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
  }
}

export default StartPage
