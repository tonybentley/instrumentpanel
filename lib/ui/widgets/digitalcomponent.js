import React from 'react';
import moment from 'moment';

export default class DigitalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '-',
      timestamp: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.valueStream !== this.props.valueStream) {
      if (nextProps.valueStream) {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
        this.unsubscribe = nextProps.valueStream.onValues(function(value, timestamp) {

          console.log(nextProps.path, timestamp, typeof timestamp)
          
          this.setState({
            timestamp: displayTimestamp(timestamp),
            value: displayValue(value)
          });
        }.bind(this));
      }
    }
  }

  componentDidMount() {
    if (this.props.valueStream) {
        if (this.unsubscribe) {
          this.unsubscribe();
        }

        this.unsubscribe = this.props.valueStream.onValues(function(value, timestamp) {
         
          this.setState({
            timestamp: displayTimestamp(timestamp),
            value: displayValue(value)
          });
      }.bind(this));
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    return (
      <svg height="100%" width="100%" viewBox="0 0 20 33">
        <text x="10" y="4" textAnchor="middle" fontSize="6" dominantBaseline="middle">
          {this.props.label}
        </text>
        <g transform="translate(10, 0)">
          <text textAnchor="middle" y="20" fontSize="20" dominantBaseline="middle">
            {this.state.value.toString()}
          </text>
          <text textAnchor="middle" y="30" fontSize="6" dominantBaseline="middle">
            {moment(this.state.timestamp).fromNow()}
          </text>
          <text textAnchor="end" x="45" y="20" fontSize="10" dominantBaseline="baseline">
            {this.props.convertTo ? this.props.convertTo : this.props.unit}
          </text>
        </g>
      </svg>
    )
  }
}

function displayTimestamp(timestamp){
  return timestamp
}

function displayValue(value) {
  if(typeof value === 'number') {
    var v = Math.abs(value);
    if(v >= 50) {
      return value.toFixed(0);
    } else if(v >= 10) {
      return value.toFixed(1);
    } else {
      return value.toFixed(2);
    }
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value;
}
