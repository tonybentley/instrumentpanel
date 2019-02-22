import React from 'react';
import moment from 'moment';
export default class DigitalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '-'
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.valueStream !== this.props.valueStream) {
      if (nextProps.valueStream) {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
        this.unsubscribe = nextProps.valueStream.onValue(function(busResult) {
          if(!busResult.timestamp){
            this.setState({
              value: displayValue(busResult)
            });
          } else {
            this.setState({
              value: displayValue(busResult.value),
              timestamp: busResult.timestamp
            });         
          }

        }.bind(this));
      }
    }
  }

  componentDidMount() {
    if (this.props.valueStream) {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
        this.unsubscribe = this.props.valueStream.onValue(function(busResult) {
          this.setState({
            value: displayValue(busResult.value),
            timestamp: busResult.timestamp
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
          <text textAnchor="end" x="45" y="24" fontSize="10" dominantBaseline="baseline">
            {this.props.convertTo ? this.props.convertTo : this.props.unit}
          </text>
        </g>
      </svg>
    )
  }
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
