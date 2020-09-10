import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleInterval = undefined;
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      countdown: 1500,
      countdownLabel: "Session",
      isRunning: false
    };
  }

  // countdown value will be formatted here
  timeFormat = (countdown) => {

    let minutes = Math.floor(countdown / 60); // minutes = 25 (if countdown = 1500)
    let seconds = countdown % 60; // seconds = 0 (if countdown = 1500)

    minutes = minutes < 10 ? ('0' + minutes) : minutes;
    seconds = seconds < 10 ? ('0' + seconds) : seconds;

    return `${minutes}:${seconds}`;
  }

  handleIncrementDecrement = (e) => {
    const { breakLength, sessionLength } = this.state;
    const { id } = e.currentTarget;

    // check break and session lengths if it's between 0 and 60, inclusive
    if ((breakLength < 61 && breakLength > 0) && (sessionLength < 61 && sessionLength > 0)) {
      (id === "break-decrement") ? this.setState({ breakLength: breakLength - 1 })
        : (id === "break-increment") ? this.setState({ breakLength: breakLength + 1 })
          : (id === "session-decrement") ? this.setState({ sessionLength: sessionLength - 1, countdown: (sessionLength - 1) * 60 })
            : this.setState({ sessionLength: sessionLength + 1, countdown: (sessionLength + 1) * 60 });

    }
  }

  handleStartPause = () => {
    const { isRunning } = this.state;

    if (isRunning) {
      clearInterval(this.handleInterval);
      this.setState({ isRunning: false });
    } else {
      this.setState({ isRunning: true });
      this.handleInterval = setInterval(() => {
        const { countdown, countdownLabel, breakLength, sessionLength } = this.state;

        if (countdown === 0) {
          // new countdown begins (either a Session or Break Countdown depending on the condition)
          this.setState({
            countdown: (countdownLabel === "Session") ? (breakLength) * 60: (sessionLength) * 60,
            countdownLabel: (countdownLabel === "Session") ? "Break" : "Session"
          });
          this.audio.play();
        } else {
          // countdown continues
          this.setState({
            countdown: countdown - 1
          });
        }
      }, 1000);
    }

  }

  handleReset = () => {
    clearInterval(this.handleInterval);
    this.audio.pause();
    this.audio.currentTime = 0;
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      countdown: 25 * 60,
      countdownLabel: "Session",
      isRunning: false
    });
  }

  componentWillUnmount() {
    clearInterval(this.handleInterval);
  }

  render() {
    const { breakLength, sessionLength, countdown, countdownLabel, isRunning } = this.state;
    return (
      <div className="pomodoro-container">
        <h1>Pomodoro Clock</h1>
        <div className="flex">
          <div id="break-label">
            <h2>Break Length</h2>
            <div id="break-length" className="flex number">
              <button
                id="break-decrement"
                onClick={this.handleIncrementDecrement.bind(this)}
                disabled={(breakLength === 1) ? true : false}>
                <i className="fa fa-minus" aria-hidden="true"></i>
              </button>
              {breakLength}
              <button
                id="break-increment"
                onClick={this.handleIncrementDecrement.bind(this)}
                disabled={(breakLength === 60) ? true : false}>
                <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div id="session-label">
            <h2>Session Length</h2>
            <div id="session-length" className="flex number">
              <button
                id="session-decrement"
                onClick={this.handleIncrementDecrement.bind(this)}
                disabled={(sessionLength === 1) ? true : false}>
                <i className="fa fa-minus" aria-hidden="true"></i>
              </button>
              {sessionLength}
              <button
                id="session-increment"
                onClick={this.handleIncrementDecrement.bind(this)}
                disabled={(sessionLength === 60) ? true : false}>
                <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
        <div id="timer-label" className={(countdown<=59)?"warning":""}>
          <h2>{countdownLabel}</h2>
          <div id="time-left" className="number">
            {this.timeFormat(countdown)}
          </div>
          <div id="start-stop-reset">
            <button
              id="start_stop"
              onClick={this.handleStartPause.bind(this)}>
              {(isRunning === false) ? <i className="fa fa-play" aria-hidden="true"></i>
                : <i className="fa fa-pause" aria-hidden="true"></i>}
            </button>
            <button
              id="reset"
              onClick={this.handleReset.bind(this)}>
              <i className="fa fa-refresh" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <footer>by{' '}
            <a href="https://github.com/eljoedeleon"
              target="_blank"
              rel="noopener noreferrer">eljoedeleon</a>
          </footer>
        <audio id="beep"
          ref={ref => this.audio = ref}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav">
        </audio>
      </div>
    );
  }
}

export default App;
