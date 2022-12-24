// rollup.config.js
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

export default [{
  input: "client/bpmn-js-extension/index.js",
  output: {
    file: "dist/module.js"
  },
  plugins: [
    resolve(),
    babel({"presets": ["@babel/preset-env"], "babelHelpers": 'bundled'}),
    commonjs({
      include: "node_modules/**"
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
}, {
  input: "client/bpmn-js-extension/index.js",
  output: {
    format: "iife",
    file: "dist/module-iife.js",
    name: "RobotTaskModule"
  },
  plugins: [
    resolve(),
    babel({"presets": ["@babel/preset-env"], "babelHelpers": 'bundled'}),
    commonjs({
      include: "node_modules/**"
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
}];
