import React from "react"
import SEO from '../components/seo'

import MobileLayout from '../components/MobileLayout'
import { PrimaryButton, Link } from '../components/buttons'
import { TextInput } from '../components/inputs'
import { ErrorMessage } from '../components/typography'
import { Api } from '../lib/'

import '../styles/index.scss'

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
      console.error(error)
      this.setState({ isJoining: false, error: `Could not join room` })
    }
  }
  render() {
    const { shortcode, userName, isJoining, error } = this.state
    const cleanCode = cleanShortcode(shortcode)
    return (
      <MobileLayout id="start-page">
        <div className="container">
          <SEO title="Welcome" />
          <div id="app-name">
            <strong>TabWise</strong>
          </div>
          <h1>
            <span role="img" aria-label="hello">👋</span>
          </h1>
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
            style={{ marginTop: 20 }}
          >
            JOIN
        </PrimaryButton>
          <div className="create-tab">
            <Link
              to="/new"
            >
              start a tab
          </Link>
          </div>
        </div>
      </MobileLayout>
    )
  }
}

export default StartPage
