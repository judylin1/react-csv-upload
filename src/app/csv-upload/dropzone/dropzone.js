import { findDOMNode } from 'react-dom';
import React, { createClass, PropTypes } from 'react';

const Dropzone = createClass({

  propTypes: {
    onDrop: PropTypes.func.isRequired,
    size: PropTypes.number,
    style: PropTypes.object,
    disableClick: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.any,
  },

  getInitialState() {
    return {
      isDragActive: false,
    };
  },

  onDragLeave() {
    this.setState({
      isDragActive: false,
    });
  },

  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    this.setState({
      isDragActive: true,
    });
  },

  onDrop(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false,
    });

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    if (this.props.onDrop) {
      files = Array.prototype.slice.call(files);
      this.props.onDrop(files);
    }
  },

  _click() {
    if (findDOMNode(this.refs.fileInput).value) findDOMNode(this.refs.fileInput).value = null;
    if (!this.props.disableClick) {
      this._triggerClick();
    }
  },

  openFileBox() {
    this._triggerClick();
  },

  _triggerClick() {
    findDOMNode(this.refs.fileInput).click();
  },

  render() {
    let className = this.props.className || 'dropzone';
    if (this.state.isDragActive) {
      className += ' active';
    }
    const style = this.props.style;

    return (
      <div className={className} style={style} onClick={this._click} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={this.onDrop}>
        <input style={{ display: 'none' }} type="file" multiple ref="fileInput" onChange={this.onDrop} />
        {this.props.children}
      </div>
    );
  },

});

export default Dropzone;
