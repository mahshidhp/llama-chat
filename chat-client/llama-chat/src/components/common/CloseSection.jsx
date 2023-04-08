import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

class CloseSection extends Component {
  render() {
    return (
      <div className="row justify-content-start position-absolute top-0 w-100 close-section px-0 mx-0">
        <div className="col-sm-1 px-0 m-3">
          <button className="btn cursor-pointer" onClick={this.props.onClose}>
            <FontAwesomeIcon icon={faX} size="xl" style={{ color: '#000' }} />
          </button>
        </div>
      </div>
    )
  }
}

export default CloseSection
