import './index.scss';

import React from 'react';
import SliderComponent from 'react-slider';

class HistorySliderComponent extends React.Component {

  onSliderChange(value) {
    var h = this.props.plugin.history;
    h.move(value);
  }

  render() {

    var plugin  = this.props.plugin;
    var history = plugin.history;

    if (history.length < 2) {
      return null;
    }

    return <SliderComponent
      max={history.length - 1}
      value={history.position}
      onChange={this.onSliderChange.bind(this)}
      className='m-history-slider' />;
  }
}

export default HistorySliderComponent;