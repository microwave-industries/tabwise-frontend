import React from 'react'
import { navigate } from "gatsby"
import styled from 'styled-components'
import { Camera, CheckCircle } from 'react-feather'
import MobileLayout from '../components/MobileLayout'
import { PrimaryButton } from '../components/buttons'
import { MinimalTextInput } from '../components/inputs'
import { ErrorMessage } from '../components/typography'

import Api from '../lib/Api'

import '../styles/new.scss'

const InstructionsContainer = styled.div({
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `center`,
  alignItems: `center`
})

const Instructions = styled.span({
  textAlign: `center`
})

const PhotoUpload = styled.input({
  display: `none`
})

class NewTab extends React.Component {
  constructor() {
    super()
    this.state = {
      paymentUrl: ``,
      photo: null,
      error: null,
      creatingTab: false,
    }
  }
  openCamera = () => document.getElementById(`photoUpload`).click()
  onSelectPhoto = (e) => this.setState({ photo: e.target.files[0] })
  onChange = key => ({ target: { value } }) => this.setState({ [key]: value })

  componentDidMount() {
    const paymentUrl = localStorage.getItem(`paymentUrl`)
    if (typeof paymentUrl === `string` && paymentUrl.length > 0) {
      this.setState({ paymentUrl })
    }
  }

  createTab = async () => {
    const { paymentUrl, photo } = this.state
    localStorage.setItem(`paymentUrl`, paymentUrl)
    if (paymentUrl.length === 0 || photo === null) {
      return this.setState({ error: `Ensure all fields are filled` })
    }
    try {
      this.setState({ creatingTab: true })
      const { code } = await Api.uploadReceipt(photo, paymentUrl)
      navigate(`/tab?shortcode=${code}`)
    } catch (error) {
      this.setState({
        error: `Oops, an error occurred when uploading that receipt`,
        creatingTab: false
      })
    }
  }

  render() {
    const { paymentUrl, photo, error, creatingTab } = this.state
    return (
      <MobileLayout id="new-tab">
        <div className="container">
          <MinimalTextInput
            style={{ fontSize: `1.5em` }}
            placeholder="Monzo/Starling URL"
            value={paymentUrl}
            onChange={this.onChange(`paymentUrl`)}
          />
          <div
            className="upload-container"
            onClick={this.openCamera}
            style={{ borderColor: photo === null ? `#353b48` : `#218c74` }}
          >
            <InstructionsContainer>
              {
                photo === null ? (
                  <>
                    <Camera size={40} color="#353b48" />
                    <Instructions>
                      Snap a photo of your receipt
                  </Instructions>
                  </>
                ) : (
                    <>
                      <img
                        src={URL.createObjectURL(photo)}
                        style={{ maxWidth: `80%`, maxHeight: `200px`, marginBottom: 20 }}
                        alt="receipt preview"
                      />
                      <CheckCircle size={40} color="#218c74" />
                    </>
                  )
              }
              <PhotoUpload
                id="photoUpload"
                type="file"
                accept="image/*"
                // capture="camera"
                ref={this.fileInput}
                onChange={this.onSelectPhoto}
              />
            </InstructionsContainer>
          </div>
          {
            error ? (
              <ErrorMessage style={{ marginTop: 20 }}>
                {error}
              </ErrorMessage>
            ) : null
          }
        </div>
        <PrimaryButton
          onClick={this.createTab}
          isLoading={creatingTab}
          loadingText="PROCESSING..."
        >
          NEXT
        </PrimaryButton>
      </MobileLayout>
    )
  }
}

export default NewTab
