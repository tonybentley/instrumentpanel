import React from 'react';
import moment from '../../util/moment';

export default class DigitalComponent extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      value: '-',
      timestamp: '-'
    };
    this._intervals = {};
    this._isMounted = false;
  }


  componentWillReceiveProps(nextProps) {
    var that = this;

    if(nextProps.timestampStream !== that.props.timestampStream){
      nextProps.timestampStream.onValue(function(timestamp) {
        if(that._intervals[nextProps.path]){
          clearInterval(that._intervals[nextProps.path])
        }
        that._intervals[nextProps.path] = setInterval(
          function(){
            if(that._isMounted){
              that.setState({
                timestamp: moment(timestamp).fromNowOrNow()
              });   
            }
          }
        ,100)
      })
    }

    if(nextProps.valueStream !== that.props.valueStream) {
      if (nextProps.valueStream) {
        if (that.unsubscribe) {
          that.unsubscribe();
        }
        that.unsubscribe = nextProps.valueStream.onValue(function(value) {
          that.setState({
            value: displayValue(value)
          });
        });

      }
    }
  }

  componentDidMount() {
    
    var that = this;

    that._isMounted = true;

    if (that.props.timestampStream) {
      that.props.timestampStream.onValue(function(timestamp) {
        if(that._isMounted){
          that.setState({
            timestamp: moment(timestamp).fromNowOrNow()
          });   
        }
     
      });
    }
    if (that.props.valueStream) {
      if (that.unsubscribe) {
        that.unsubscribe();
      }
      that.unsubscribe = that.props.valueStream.onValue(function(value) {
        that.setState({
          value: displayValue(value)
        });
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
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
          <text textAnchor="middle" y="23" fontSize="28" dominantBaseline="middle">
            {this.state.value.toString()}
          </text>
          <text textAnchor="end" x="45" y="30" fontSize="10" dominantBaseline="baseline">
            {this.props.convertTo ? this.props.convertTo : this.props.unit}
          </text>
          <text textAnchor="middle" y="8" fontSize="4" dominantBaseline="middle">
            {this.state.timestamp}
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
