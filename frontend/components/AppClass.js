// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  getXY = () => {
    const { index } = this.state
    const x = (index % 3) + 1
    const y = Math.floor(index / 3) + 1
    return { x, y }
  }

  getXYMessage = () => {
    const { x, y } = this.getXY()
    return `Coordinates (${x}, ${y})`
  }

  reset = () => {
    this.setState(initialState)
  }

  getNextIndex = (direction) => {
    const { index } = this.state

    switch (direction) {
      case 'left':
        return index % 3 === 0 ? index : index - 1
      case 'right':
        return index % 3 === 2 ? index : index + 1
      case 'up':
        return index < 3 ? index : index - 3
      case 'down':
        return index > 5 ? index : index + 3
      default:
        return index
    }
  }

  move = (evt) => {
    const direction = evt.target.id
    const newIndex = this.getNextIndex(direction)

    if (newIndex !== this.state.index) {
      this.setState(prevState => ({
        index: newIndex,
        steps: prevState.steps + 1
      }))
    }
  }

  onChange = (evt) => {
    this.setState({ email: evt.target.value })
  }

  onSubmit = async (evt) => {
    evt.preventDefault()

    const { x, y } = this.getXY()
    const { steps, email } = this.state

    try {
      const response = await axios.post('http://localhost:9000/api/result', {
        x,
        y,
        steps,
        email
      })

      this.setState({ message: response.data.message })
    } catch (err) {
      this.setState({
        message: err.response?.data?.message || 'An error occurred'
      })
    }
  }

  render() {
    const { className } = this.props
    const { index, steps, email, message } = this.state

    return (
      <div id="wrapper" className={className}>
        <p>(This component is not required to pass the sprint)</p>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
                {idx === index ? 'B' : null}
              </div>
            ))
          }
          </div>
          <div className="info">
            <h3 id="message">{message}</h3>
          </div>
          <div id="keypad">
            <button id="left" onClick={this.move}>LEFT</button>
            <button id="up" onClick={this.move}>UP</button>
            <button id="right" onClick={this.move}>RIGHT</button>
            <button id="down" onClick={this.move}>DOWN</button>
            <button id="reset" onClick={this.reset}>reset</button>
          </div>
          <form onSubmit={this.onSubmit}>
            <input id="email" type="email" placeholder="type email" value={email} onChange={this.onChange} />
            <input id="submit" type="submit" />
          </form>
        </div>
    )
  }
}
