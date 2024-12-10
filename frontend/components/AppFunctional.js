import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // State management
  const [index, setIndex] = useState(initialIndex)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [message, setMessage] = useState(initialMessage)

  function getXY() {
    const x = (index % 3) + 1
    const y = Math.floor(index / 3) + 1
    return { x, y }
  }

  function getXYMessage() {
    const { x, y } = getXY()
    return `Coordinates (${x}, ${y})`
  }

  function reset() {
    setIndex(initialIndex)
    setSteps(initialSteps)
    setEmail(initialEmail)
    setMessage(initialMessage)
  }

  function getNextIndex(direction) {
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

  function move(evt) {
    const direction = evt.target.id
    const newIndex = getNextIndex(direction)

    if (newIndex === index) {
      // Set a message when movement is not possible
      switch (direction) {
        case 'up':
          setMessage("You can't go up")
          break
        case 'down':
          setMessage("You can't go down")
          break
        case 'left':
          setMessage("You can't go left")
          break
        case 'right':
          setMessage("You can't go right")
          break
      }
    } else {
      setIndex(newIndex)
      setSteps(prevSteps => prevSteps + 1)
      setMessage('')
    }

    if (newIndex !== index) {
      setIndex(newIndex)
      setSteps(prevSteps => prevSteps + 1)
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value)
  }

  async function onSubmit(evt) {
    evt.preventDefault()

    const { x, y } = getXY()
    
    try {
      const response = await axios.post('http://localhost:9000/api/result', {
        x,
        y,
        steps,
        email
      })

      setMessage(response.data.message)
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred')
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
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
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange} />
        <input id="submit" type="submit" />
      </form>
    </div>
  )
}
