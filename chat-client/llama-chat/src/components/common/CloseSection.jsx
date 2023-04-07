import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

class CloseSection extends Component {
  render() {
    return (
      <div className="row justify-content-start">
        <div className="col-sm-1 px-3 m-3">
          <button className="btn cursor-pointer" onClick={this.props.onClose}>
            <FontAwesomeIcon icon={faX} size="xl" style={{ color: '#000' }} />
          </button>
        </div>
      </div>
    )
  }
}

export default CloseSection
