import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

export default class ClickToCopy extends Component {
  constructor(props) {
    super(props)
    this.textAreaRef = React.createRef()
    this.state = {
      popoverVisible: false
    }
  }

  static propTypes = {
    contentToCopy: PropTypes.string.isRequired
  }

  copyToClipboard = e => {
    this.textAreaRef.current.select()
    document.execCommand('copy')
    if (this.props.onCopy) {
      this.props.onCopy()
    } else {
      this.togglePopover()
    }
  }

  togglePopover() {
    if (this.state.popoverVisible) {
      if (this.popoverTimeout) {
        clearTimeout(this.popoverTimeout)
      }
      this.setState({
        popoverVisible: false
      })
    } else {
      this.setState(
        {
          popoverVisible: true
        },
        () => {
          this.popoverTimeout = setTimeout(() => {
            this.setState({
              popoverVisible: false
            })
          }, 3000)
        }
      )
    }
  }

  render() {
    let UIToRender = <button
      type='button'
      className={styles.btnDefault}
      onClick={this.copyToClipboard}
    >
      Copy
    </button>

    if (this.props.children) {
      UIToRender = this.props.children({ copy: this.copyToClipboard })
    } else {
      UIToRender = this.props.render({ copy: this.copyToClipboard })
    }

    return (
      <form className={styles.reactClickCopy}>
        <div
          style={{
            display: this.state.popoverVisible ? 'block' : 'none'
          }}
          className={styles.popover}
        >
          Copied Successfully!
        </div>
        <div
          className={styles.popoverBgOverlay}
          style={{
            visibility: this.state.popoverVisible ? 'visible' : 'hidden'
          }}
          onClick={() => this.togglePopover()}
        />
        <textarea
          className={styles.textarea}
          ref={this.textAreaRef}
          value={this.props.contentToCopy}
          rows={0}
          cols={0}
          readOnly
        />
        {UIToRender}
      </form>
    )
  }
}
