import React from 'react'

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group my-2">
      <label htmlFor={name}>{label}</label>
      <input {...rest} name={name} id={name} className="form-control" />
      {error && <div className="alert alert-danger my-2 py-2">{error}</div>}
    </div>
  )
}

export default Input
