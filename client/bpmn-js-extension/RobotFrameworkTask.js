import inherits from 'inherits/inherits_browser';
import {
  is,
} from 'bpmn-js/lib/util/ModelUtil';

import {
  append as svgAppend,
  create as svgCreate
} from 'tiny-svg';

import Robot from './robot-framework.svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

export default function RobotRenderer(eventBus, bpmnRenderer) {
  BaseRenderer.call(this, eventBus, 1500);
  this.canRender = function(element) {
    return is(element, 'bpmn:ServiceTask') && element.id.match(/robot/i);
  };
  this.drawShape = function(parent, element) {
    const shape = bpmnRenderer.handlers["bpmn:Task"](parent, element);
    var gfx = svgCreate('image', {
      x: -1,
      y: -1,
      width: 32, // element.width,
      height: 32, //  element.height,
      href: Robot
    });

    svgAppend(parent, gfx);

    return gfx;
  };
}

inherits(RobotRenderer, BaseRenderer);

RobotRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ];
