import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import Logo from '../Logo'

import './index.css'

class Sign extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSuccess = requestToken => {
    const {history} = this.props
    const {username, password} = this.state

    Cookies.set('requestToken', requestToken, {
      expires: 30,
      path: '/',
    })
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)

    history.replace('/')
  }

  onFailure = () => {
    this.setState({showSubmitError: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const requestTokenResponse = await fetch(
      'https://api.themoviedb.org/3/authentication/token/new?api_key=bb6a5dc02b7a92508622341b49e23f59',
    )
    const json = await requestTokenResponse.json()
    const userDetails = {
      username,
      password,
      request_token: json.request_token,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
      headers: {
        'Content-type': 'application/json',
      },
    }
    const url =
      'https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=bb6a5dc02b7a92508622341b49e23f59'
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccess(data.request_token)
    } else {
      this.onFailure()
    }
  }

  renderPassword = () => {
    const {password} = this.state
    return (
      <>
        <label className="label-element" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="username-field"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderUsername = () => {
    const {username} = this.state
    return (
      <>
        <label className="label-element" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-field"
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  render() {
    const {showSubmitError} = this.state
    const requestToken = Cookies.get('requestToken')
    if (requestToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="sign-in-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <Logo />
          <h1 className="sign-heading">Sign in</h1>
          <div className="input-container">{this.renderUsername()}</div>
          <div className="input-container">{this.renderPassword()}</div>
          {showSubmitError && (
            <p className="e-message">
              Please Enter a valid username & password
            </p>
          )}
          <button type="submit" className="sign-button">
            Sign in
          </button>
        </form>
      </div>
    )
  }
}

export default Sign
