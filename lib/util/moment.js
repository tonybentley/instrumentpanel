import moment from 'moment';

moment.fn.fromNowOrNow = function (a) {
	const miliseconds = Math.abs(moment().diff(this));
  if (miliseconds < 1000) {
      return 'just now';
  } else if (miliseconds < 60000){
  	return (miliseconds / 1000).toFixed(0) + ' seconds ago'
  }
  return this.fromNow(a);
}

module.exports = moment;