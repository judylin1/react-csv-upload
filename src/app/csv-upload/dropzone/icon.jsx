import getClassNames from 'classnames';
import React, { createClass, PropTypes } from 'react';

const Icon = createClass({

  propTypes: {
    className: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.any,
  },

  render() {
    const { className, label, ...other } = this.props;
    const classes = getClassNames('tc-icon', className);
    let child;
    if (label) {
      child = (
        <div
          style={{
            'display': 'inline-block',
            'fontFamily': 'Open Sans',
            'marginLeft': '4px,',
          }}
          className="tc-icon-label"
        >
          {label}
        </div>
      );
    } else {
      child = this.props.children;
    }

    return (
      <span {...other} className={classes}>{child}</span>
    );
  },

});

export default Icon;
