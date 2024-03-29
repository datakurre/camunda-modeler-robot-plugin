(function () {
  'use strict';

  /**
   * Validate and register a client plugin.
   *
   * @param {Object} plugin
   * @param {String} type
   */
  function registerClientPlugin(plugin, type) {
    var plugins = window.plugins || [];
    window.plugins = plugins;

    if (!plugin) {
      throw new Error('plugin not specified');
    }

    if (!type) {
      throw new Error('type not specified');
    }

    plugins.push({
      plugin: plugin,
      type: type
    });
  }
  /**
   * Validate and register a bpmn-js plugin.
   *
   * @param {Object} module
   *
   * @example
   *
   * import {
   *   registerBpmnJSPlugin
   * } from 'camunda-modeler-plugin-helpers';
   *
   * const BpmnJSModule = {
   *   __init__: [ 'myService' ],
   *   myService: [ 'type', ... ]
   * };
   *
   * registerBpmnJSPlugin(BpmnJSModule);
   */

  function registerBpmnJSPlugin(module) {
    registerClientPlugin(module, 'bpmn.modeler.additionalModules');
  }

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var inherits_browser = createCommonjsModule(function (module) {
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;

        var TempCtor = function TempCtor() {};

        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }
  });

  /**
   * Is an element of the given BPMN type?
   *
   * @param  {djs.model.Base|ModdleElement} element
   * @param  {string} type
   *
   * @return {boolean}
   */
  function is(element, type) {
    var bo = getBusinessObject(element);
    return bo && typeof bo.$instanceOf === 'function' && bo.$instanceOf(type);
  }
  /**
   * Return the business object for a given element.
   *
   * @param  {djs.model.Base|ModdleElement} element
   *
   * @return {ModdleElement}
   */

  function getBusinessObject(element) {
    return element && element.businessObject || element;
  }

  function ensureImported(element, target) {
    if (element.ownerDocument !== target.ownerDocument) {
      try {
        // may fail on webkit
        return target.ownerDocument.importNode(element, true);
      } catch (e) {// ignore
      }
    }

    return element;
  }
  /**
   * appendTo utility
   */

  /**
   * Append a node to a target element and return the appended node.
   *
   * @param  {SVGElement} element
   * @param  {SVGElement} target
   *
   * @return {SVGElement} the appended node
   */


  function appendTo(element, target) {
    return target.appendChild(ensureImported(element, target));
  }
  /**
   * append utility
   */

  /**
   * Append a node to an element
   *
   * @param  {SVGElement} element
   * @param  {SVGElement} node
   *
   * @return {SVGElement} the element
   */


  function append(target, node) {
    appendTo(node, target);
    return target;
  }
  /**
   * attribute accessor utility
   */


  var LENGTH_ATTR = 2;
  var CSS_PROPERTIES = {
    'alignment-baseline': 1,
    'baseline-shift': 1,
    'clip': 1,
    'clip-path': 1,
    'clip-rule': 1,
    'color': 1,
    'color-interpolation': 1,
    'color-interpolation-filters': 1,
    'color-profile': 1,
    'color-rendering': 1,
    'cursor': 1,
    'direction': 1,
    'display': 1,
    'dominant-baseline': 1,
    'enable-background': 1,
    'fill': 1,
    'fill-opacity': 1,
    'fill-rule': 1,
    'filter': 1,
    'flood-color': 1,
    'flood-opacity': 1,
    'font': 1,
    'font-family': 1,
    'font-size': LENGTH_ATTR,
    'font-size-adjust': 1,
    'font-stretch': 1,
    'font-style': 1,
    'font-variant': 1,
    'font-weight': 1,
    'glyph-orientation-horizontal': 1,
    'glyph-orientation-vertical': 1,
    'image-rendering': 1,
    'kerning': 1,
    'letter-spacing': 1,
    'lighting-color': 1,
    'marker': 1,
    'marker-end': 1,
    'marker-mid': 1,
    'marker-start': 1,
    'mask': 1,
    'opacity': 1,
    'overflow': 1,
    'pointer-events': 1,
    'shape-rendering': 1,
    'stop-color': 1,
    'stop-opacity': 1,
    'stroke': 1,
    'stroke-dasharray': 1,
    'stroke-dashoffset': 1,
    'stroke-linecap': 1,
    'stroke-linejoin': 1,
    'stroke-miterlimit': 1,
    'stroke-opacity': 1,
    'stroke-width': LENGTH_ATTR,
    'text-anchor': 1,
    'text-decoration': 1,
    'text-rendering': 1,
    'unicode-bidi': 1,
    'visibility': 1,
    'word-spacing': 1,
    'writing-mode': 1
  };

  function getAttribute(node, name) {
    if (CSS_PROPERTIES[name]) {
      return node.style[name];
    } else {
      return node.getAttributeNS(null, name);
    }
  }

  function setAttribute(node, name, value) {
    var hyphenated = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    var type = CSS_PROPERTIES[hyphenated];

    if (type) {
      // append pixel unit, unless present
      if (type === LENGTH_ATTR && typeof value === 'number') {
        value = String(value) + 'px';
      }

      node.style[hyphenated] = value;
    } else {
      node.setAttributeNS(null, name, value);
    }
  }

  function setAttributes(node, attrs) {
    var names = Object.keys(attrs),
        i,
        name;

    for (i = 0, name; name = names[i]; i++) {
      setAttribute(node, name, attrs[name]);
    }
  }
  /**
   * Gets or sets raw attributes on a node.
   *
   * @param  {SVGElement} node
   * @param  {Object} [attrs]
   * @param  {String} [name]
   * @param  {String} [value]
   *
   * @return {String}
   */


  function attr(node, name, value) {
    if (typeof name === 'string') {
      if (value !== undefined) {
        setAttribute(node, name, value);
      } else {
        return getAttribute(node, name);
      }
    } else {
      setAttributes(node, name);
    }

    return node;
  }

  function remove(element) {
    var parent = element.parentNode;

    if (parent) {
      parent.removeChild(element);
    }

    return element;
  }
  /**
   * Clear utility
   */

  /**
   * Removes all children from the given element
   *
   * @param  {DOMElement} element
   * @return {DOMElement} the element (for chaining)
   */


  function clear(element) {
    var child;

    while (child = element.firstChild) {
      remove(child);
    }

    return element;
  }

  var ns = {
    svg: 'http://www.w3.org/2000/svg'
  };
  /**
   * DOM parsing utility
   */

  var SVG_START = '<svg xmlns="' + ns.svg + '"';

  function parse(svg) {
    var unwrap = false; // ensure we import a valid svg document

    if (svg.substring(0, 4) === '<svg') {
      if (svg.indexOf(ns.svg) === -1) {
        svg = SVG_START + svg.substring(4);
      }
    } else {
      // namespace svg
      svg = SVG_START + '>' + svg + '</svg>';
      unwrap = true;
    }

    var parsed = parseDocument(svg);

    if (!unwrap) {
      return parsed;
    }

    var fragment = document.createDocumentFragment();
    var parent = parsed.firstChild;

    while (parent.firstChild) {
      fragment.appendChild(parent.firstChild);
    }

    return fragment;
  }

  function parseDocument(svg) {
    var parser; // parse

    parser = new DOMParser();
    parser.async = false;
    return parser.parseFromString(svg, 'text/xml');
  }
  /**
   * Create utility for SVG elements
   */

  /**
   * Create a specific type from name or SVG markup.
   *
   * @param {String} name the name or markup of the element
   * @param {Object} [attrs] attributes to set on the element
   *
   * @returns {SVGElement}
   */


  function create(name, attrs) {
    var element;

    if (name.charAt(0) === '<') {
      element = parse(name).firstChild;
      element = document.importNode(element, true);
    } else {
      element = document.createElementNS(ns.svg, name);
    }

    if (attrs) {
      attr(element, attrs);
    }

    return element;
  }
  /**
   * Geometry helpers
   */
  // fake node used to instantiate svg geometry elements


  var node = create('svg');
  /**
   * Serialization util
   */


  var TEXT_ENTITIES = /([&<>]{1})/g;
  var ATTR_ENTITIES = /([\n\r"]{1})/g;
  var ENTITY_REPLACEMENT = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '\''
  };

  function escape(str, pattern) {
    function replaceFn(match, entity) {
      return ENTITY_REPLACEMENT[entity] || entity;
    }

    return str.replace(pattern, replaceFn);
  }

  function serialize(node, output) {
    var i, len, attrMap, attrNode, childNodes;

    switch (node.nodeType) {
      // TEXT
      case 3:
        // replace special XML characters
        output.push(escape(node.textContent, TEXT_ENTITIES));
        break;
      // ELEMENT

      case 1:
        output.push('<', node.tagName);

        if (node.hasAttributes()) {
          attrMap = node.attributes;

          for (i = 0, len = attrMap.length; i < len; ++i) {
            attrNode = attrMap.item(i);
            output.push(' ', attrNode.name, '="', escape(attrNode.value, ATTR_ENTITIES), '"');
          }
        }

        if (node.hasChildNodes()) {
          output.push('>');
          childNodes = node.childNodes;

          for (i = 0, len = childNodes.length; i < len; ++i) {
            serialize(childNodes.item(i), output);
          }

          output.push('</', node.tagName, '>');
        } else {
          output.push('/>');
        }

        break;
      // COMMENT

      case 8:
        output.push('<!--', escape(node.nodeValue, TEXT_ENTITIES), '-->');
        break;
      // CDATA

      case 4:
        output.push('<![CDATA[', node.nodeValue, ']]>');
        break;

      default:
        throw new Error('unable to handle node ' + node.nodeType);
    }

    return output;
  }
  /**
   * innerHTML like functionality for SVG elements.
   * based on innerSVG (https://code.google.com/p/innersvg)
   */


  function set(element, svg) {
    var parsed = parse(svg); // clear element contents

    clear(element);

    if (!svg) {
      return;
    }

    if (!isFragment(parsed)) {
      // extract <svg> from parsed document
      parsed = parsed.documentElement;
    }

    var nodes = slice(parsed.childNodes); // import + append each node

    for (var i = 0; i < nodes.length; i++) {
      appendTo(nodes[i], element);
    }
  }

  function get(element) {
    var child = element.firstChild,
        output = [];

    while (child) {
      serialize(child, output);
      child = child.nextSibling;
    }

    return output.join('');
  }

  function isFragment(node) {
    return node.nodeName === '#document-fragment';
  }

  function innerSVG(element, svg) {
    if (svg !== undefined) {
      try {
        set(element, svg);
      } catch (e) {
        throw new Error('error parsing SVG: ' + e.message);
      }

      return element;
    } else {
      return get(element);
    }
  }

  function slice(arr) {
    return Array.prototype.slice.call(arr);
  }

  var DEFAULT_RENDER_PRIORITY = 1000;
  /**
   * The base implementation of shape and connection renderers.
   *
   * @param {EventBus} eventBus
   * @param {number} [renderPriority=1000]
   */

  function BaseRenderer(eventBus, renderPriority) {
    var self = this;
    renderPriority = renderPriority || DEFAULT_RENDER_PRIORITY;
    eventBus.on(['render.shape', 'render.connection'], renderPriority, function (evt, context) {
      var type = evt.type,
          element = context.element,
          visuals = context.gfx;

      if (self.canRender(element)) {
        if (type === 'render.shape') {
          return self.drawShape(visuals, element);
        } else {
          return self.drawConnection(visuals, element);
        }
      }
    });
    eventBus.on(['render.getShapePath', 'render.getConnectionPath'], renderPriority, function (evt, element) {
      if (self.canRender(element)) {
        if (evt.type === 'render.getShapePath') {
          return self.getShapePath(element);
        } else {
          return self.getConnectionPath(element);
        }
      }
    });
  }
  /**
   * Should check whether *this* renderer can render
   * the element/connection.
   *
   * @param {element} element
   *
   * @returns {boolean}
   */

  BaseRenderer.prototype.canRender = function () {};
  /**
   * Provides the shape's snap svg element to be drawn on the `canvas`.
   *
   * @param {djs.Graphics} visuals
   * @param {Shape} shape
   *
   * @returns {Snap.svg} [returns a Snap.svg paper element ]
   */


  BaseRenderer.prototype.drawShape = function () {};
  /**
   * Provides the shape's snap svg element to be drawn on the `canvas`.
   *
   * @param {djs.Graphics} visuals
   * @param {Connection} connection
   *
   * @returns {Snap.svg} [returns a Snap.svg paper element ]
   */


  BaseRenderer.prototype.drawConnection = function () {};
  /**
   * Gets the SVG path of a shape that represents it's visual bounds.
   *
   * @param {Shape} shape
   *
   * @return {string} svg path
   */


  BaseRenderer.prototype.getShapePath = function () {};
  /**
   * Gets the SVG path of a connection that represents it's visual bounds.
   *
   * @param {Connection} connection
   *
   * @return {string} svg path
   */


  BaseRenderer.prototype.getConnectionPath = function () {};

  var Robot = '<path id="path22" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 c 0,7.6 6.179,13.779 13.77,13.779 7.6,0 13.779,-6.179 13.779,-13.779 0,-2.769 -2.238,-5.007 -4.998,-5.007 -2.761,0 -4.999,2.238 -4.999,5.007 0,2.078 -1.695,3.765 -3.782,3.765 C 11.693,3.765 9.997,2.078 9.997,0 9.997,-2.769 7.76,-5.007 4.999,-5.007 2.238,-5.007 0,-2.769 0,0 m 57.05,-23.153 c 0,-2.771 -2.237,-5.007 -4.998,-5.007 l -46.378,0 c -2.761,0 -4.999,2.236 -4.999,5.007 0,2.769 2.238,5.007 4.999,5.007 l 46.378,0 c 2.761,0 4.998,-2.238 4.998,-5.007 M 35.379,-2.805 c -1.545,2.291 -0.941,5.398 1.35,6.943 l 11.594,7.83 c 2.273,1.58 5.398,0.941 6.943,-1.332 1.545,-2.29 0.941,-5.398 -1.35,-6.943 l -11.594,-7.83 c -0.852,-0.586 -1.829,-0.87 -2.788,-0.87 -1.607,0 -3.187,0.781 -4.155,2.202 m 31.748,-30.786 c 0,-0.945 -0.376,-1.852 -1.045,-2.522 l -8.617,-8.617 c -0.669,-0.668 -1.576,-1.045 -2.523,-1.045 l -52.833,0 c -0.947,0 -1.854,0.377 -2.523,1.045 l -8.617,8.617 c -0.669,0.67 -1.045,1.577 -1.045,2.522 l 0,52.799 c 0,0.947 0.376,1.854 1.045,2.522 l 8.617,8.619 c 0.669,0.668 1.576,1.044 2.523,1.044 l 52.833,0 c 0.947,0 1.854,-0.376 2.523,-1.044 l 8.617,-8.619 c 0.669,-0.668 1.045,-1.575 1.045,-2.522 l 0,-52.799 z m 7.334,61.086 -11.25,11.25 c -1.705,1.705 -4.018,2.663 -6.428,2.663 l -56.523,0 c -2.412,0 -4.725,-0.959 -6.43,-2.665 L -17.412,27.494 c -1.704,-1.705 -2.661,-4.016 -2.661,-6.427 l 0,-56.515 c 0,-2.411 0.958,-4.725 2.663,-6.428 l 11.25,-11.25 c 1.705,-1.705 4.017,-2.662 6.428,-2.662 l 56.515,0 c 2.41,0 4.723,0.957 6.428,2.662 l 11.25,11.25 c 1.705,1.703 2.663,4.017 2.663,6.428 l 0,56.514 c 0,2.412 -0.958,4.724 -2.663,6.429" />';
  function RobotRenderer(eventBus, bpmnRenderer) {
    BaseRenderer.call(this, eventBus, 1500);

    this.canRender = function (element) {
      return is(element, 'bpmn:ServiceTask') && !!element.id && !!element.id.match(/robot/i);
    };

    this.drawShape = function (parent, element) {
      var shape = bpmnRenderer.handlers["bpmn:Task"](parent, element);

      if (is(element, 'bpmn:ServiceTask')) {
        var element = create('g', {
          transform: 'matrix(1 0 0 -1 5 5) translate(2.5 -7) scale(' + 40. / 202.4325 + ' ' + 40. / 202.4325 + ')'
        });
        innerSVG(element, Robot);
        append(parent, element);
      }

      return shape;
    };
  }
  inherits_browser(RobotRenderer, BaseRenderer);
  RobotRenderer.$inject = ['eventBus', 'bpmnRenderer'];

  var BpmnExtensionModule = {
    __init__: ['RobotFrameworkTask'],
    RobotFrameworkTask: ['type', RobotRenderer]
  };

  registerBpmnJSPlugin(BpmnExtensionModule);

}());
