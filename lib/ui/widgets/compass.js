import React from 'react';
import util from 'util'

import { getConversionsForUnit } from '../settings/conversions'
import ReadingComponent from './compassreadingcomponent';
import RoseComponent from './compassrosecomponent';
import DigitalComponent from './digitalcomponent';
import BaseWidget from './basewidget';

var SettingsPanel = (props) => {
  return (
    <div>
      {props.gaugeTypes.map((gaugeType, i) => {
        return (<span key={i}>
        <input type="radio"
               key={i}
               name={props.options.key + gaugeType}
               id={props.options.key + gaugeType}
               checked={props.options.selectedWidget === i}
               onChange={props.onChange.bind(this, i)} />
        <label htmlFor={props.options.key + gaugeType} style={{marginLeft: 10}}>{gaugeType}</label>
        <br/>
        </span>
      )
      })}
      <br/>
    </div>
  )
}

var pathsCovered = [
  "navigation.courseOverGroundTrue",
  "navigation.courseOverGroundMagnetic",
  "navigation.headingMagnetic",
  "navigation.headingTrue",
  "environment.wind.directionMagnetic",
  "environment.wind.directionTrue"
];

function Compass(id, options, streamBundle, instrumentPanel) {
  BaseWidget.call(this, id, options, streamBundle, instrumentPanel);
  this.options.initialDimensions = this.options.initialDimensions || {w: 2, h: 4};
  var valueStream = streamBundle.getStreamForSourcePath(options.sourceId, options.path);
  this.widgets = [React.createElement(RoseComponent,{
    key: id,
    sourceId: options.sourceId
  }),
  React.createElement(ReadingComponent,{
    key: id,
    sourceId: options.sourceId
  }), React.createElement(DigitalComponent,{
    key: id,
    unit: this.options.unit,
    convertTo: options.convertTo,
    path: options.path,
    sourceId: options.sourceId
  })];

  this.options.selectedWidget = this.options.selectedWidget || 0;
  this.updateUnitData(this);
}

util.inherits(Compass, BaseWidget);

Compass.prototype.updateStream = function(widget, valueStream) {
  widget.widgets = [React.cloneElement(widget.widgets[0],{
    label: widget.options.label,
    value: valueStream
  }),
  React.cloneElement(widget.widgets[1],{
      label: widget.options.label,
      value: valueStream
  }), React.cloneElement(widget.widgets[2],{
    label: widget.options.label,
    unit: widget.options.unit,
    convertTo: widget.options.convertTo,
    valueStream: valueStream,
    label: widget.getLabelForPath(widget.options.path),
  })];
  widget.instrumentPanel.pushGridChanges();
}

Compass.prototype.getReactElement = function() {
  return this.widgets[this.options.selectedWidget];
}

Compass.prototype.getSettingsElement = function() {
  var that = this;
  return SettingsPanel({
    gaugeTypes: ["Rose", "Reading", "Digital"],
    options: this.options,
    onChange: function(value) {
      that.options.selectedWidget = value;
      that.instrumentPanel.persist();
      that.instrumentPanel.pushGridChanges();
    }
  });
}

Compass.prototype.getType = function() {
  return "compass";
}

Compass.prototype.getOptions = function() {
  return this.options;
}

Compass.prototype.getInitialDimensions = function() {
  return {h:4};
}

module.exports = {
  constructor: Compass,
  type: "compass",
  paths: pathsCovered
}
