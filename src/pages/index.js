import React from "react"
import styled from 'styled-components'
import SEO from '../components/seo'

import { PrimaryButton, Link } from '../components/buttons'
import { TextInput } from '../components/inputs'


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
    }
  }
  onChange = key => ({ target: { value } }) => this.setState({ [key]: value })
  render() {
    const { shortcode, userName } = this.state
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
        <PrimaryButton
          to={`/tab?shortcode=${cleanCode}&name=${userName}`}
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
