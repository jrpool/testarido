/*
  © 2024 CVS Health and/or one of its affiliates. All rights reserved.

  MIT License

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/*
  job
  Utilities about jobs and acts.
*/

// IMPORTS

// Requirements for acts.
const {actSpecs} = require('../actSpecs');
// Data on devices.
const {devices} = require('playwright');
// Module to get dates from time stamps.
const {dateOf} = require('./dateOf');

// CONSTANTS

// Names and descriptions of tools.
const tools = exports.tools = {
  alfa: 'alfa',
  aslint: 'ASLint',
  axe: 'Axe',
  ed11y: 'Editoria11y',
  htmlcs: 'HTML CodeSniffer WCAG 2.1 AA ruleset',
  ibm: 'IBM Accessibility Checker',
  nuVal: 'Nu Html Checker',
  qualWeb: 'QualWeb',
  testaro: 'Testaro',
  wax: 'WallyAX',
  wave: 'WAVE',
};

// FUNCTIONS

// Returns whether a variable has a specified type.
const hasType = (variable, type) => {
  if (type === 'string') {
    return typeof variable === 'string';
  }
  else if (type === 'array') {
    return Array.isArray(variable);
  }
  else if (type === 'boolean') {
    return typeof variable === 'boolean';
  }
  else if (type === 'number') {
    return typeof variable === 'number';
  }
  else if (type === 'object') {
    return typeof variable === 'object' && ! Array.isArray(variable);
  }
  else {
    return false;
  }
};
// Returns whether a variable has a specified subtype.
const hasSubtype = (variable, subtype) => {
  if (subtype) {
    if (subtype === 'hasLength') {
      return variable.length > 0;
    }
    else if (subtype === 'isURL') {
      return isURL(variable);
    }
    else if (subtype === 'isBrowserID') {
      return isBrowserID(variable);
    }
    else if (subtype === 'isFocusable') {
      return isFocusable(variable);
    }
    else if (subtype === 'isTest') {
      return tools[variable];
    }
    else if (subtype === 'isWaitable') {
      return ['url', 'title', 'body'].includes(variable);
    }
    else if (subtype === 'areNumbers') {
      return areNumbers(variable);
    }
    else if (subtype === 'areStrings') {
      return areStrings(variable);
    }
    else if (subtype === 'areArrays') {
      return areArrays(variable);
    }
    else if (subtype === 'isState') {
      return isState(variable);
    }
    else {
      console.log(`ERROR: ${subtype} not a known subtype`);
      return false;
    }
  }
  else {
    return true;
  }
};
// Validates a device ID.
const isDeviceID = exports.isDeviceID = deviceID => deviceID === 'default' || !! devices[deviceID];
// Validates a browser type.
const isBrowserID = exports.isBrowserID = type => ['chromium', 'firefox', 'webkit'].includes(type);
// Validates a load state.
const isState = string => ['loaded', 'idle'].includes(string);
// Validates a URL.
const isURL = exports.isURL = string => /^(?:https?|file):\/\/[^\s]+$/.test(string);
// Validates a focusable tag name.
const isFocusable = string => ['a', 'button', 'input', 'select'].includes(string);
// Returns whether all elements of an array are numbers.
const areNumbers = array => array.every(element => typeof element === 'number');
// Returns whether all elements of an array are strings.
const areStrings = array => array.every(element => typeof element === 'string');
// Returns whether all properties of an object have array values.
const areArrays = object => Object.values(object).every(value => Array.isArray(value));
// Valid values of the ifRelation property of a branch act.
const ifRelations = ['<', '=', '>', '!', true, false];
// Tool IDs.
const toolIDs = [
  'alfa',
  'aslint',
  'axe',
  'ed11y',
  'htmlcs',
  'ibm',
  'nuval',
  'qualweb',
  'testarido',
  'wallyax',
  'wave'
];
// Returns whether a branch act is valid.
const isValidBranchAct = (report, actIndex) => {
  const act = report[actIndex];
  const {what, ifProperty, ifRelation, ifValue, next} = act;
  if (
    (what === undefined || typeof what === 'string')
    && typeof ifProperty === 'string'
    && ifRelations.includes(ifRelation)
    && (ifValue === undefined || typeof ifRelation === 'string')
    && ((
      typeof next === number
      && next === Math.round(next)
      && report.acts[actIndex + next]
      && report.acts[actIndex + next].type === 'tool'
    )
    || (
      typeof next === 'string'
      && report.acts.some(act => act.type === 'tool' && act.name === next)
    ))
  ) {
    return true;
  }
  else {
    return false;
  }
};
// Returns whether a target is valid.
const isValidTarget = target => typeof target === 'object'
&& (target.what === undefined || (typeof target.what === 'string' && target.what.length))
&& (
  (target.url && typeof target.url === 'string' && target.url.length)
  || (target.dom && typeof target.dom === object)
);
// Returns whether a tool act is specially valid.
const isValidSpecialToolAct = act => {
  const {which} = act;
  if (which === 'axe') {
    const {detailLevel} = act;
    return [0, 1, 2, 3, 4].includes(detailLevel);
  }
  else if (which === 'ibm') {
    const {withItems, withNewContent} = act;
    return [withItems, withNewContent].every(property => typeof property === 'boolean');
  }
  else if (which === 'qualweb') {
    return typeof act.withNewContent === 'boolean';
  }
  else if (which === 'testarido') {
    const {withItems, stopOnFail, args} = act;
    return [withItems, stopOnFail].every(property => typeof property === 'boolean')
    && (
      args === undefined
      || typeof args === 'object' && Object.values(args).every(value => Array.isArray(value))
    );
  }
  else if (which === 'wave') {
    const {reportType, preScript, postScript} = act;
    return [1, 2, 3, 4].includes(reportType)
    && [preScript, postScript]
    .every(script => script === undefined || typeof script === 'string' && script.length);
  }
  else {
    return true;
  }
};
// Returns whether the rules property of a qualweb tool act is valid.
const areValidQualwebRules = rules => {
  const segments = rules.split(':');
  if (segments.length === 2 && segments[0].length) {
    const qwModule = segments[0];
    if (['act', 'wcag', 'best'].includes(qwModule)) {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
};
// Returns whether the rules property of a tool act is valid.
const areValidRules = (toolID, rules) => {
  if (toolID === 'qualweb') {
    return areValidQualwebRules(rules);
  }
  else {
    if (rules.length > 1 && ['y', 'n'].includes(rules[0])) {
      return true;
    }
    else {
      return false;
    }
  }
};
// Returns whether a tool act is valid.
const isValidToolAct = (report, actIndex) => {
  const act = report.acts[actIndex];
  const {what, which, name, target, rules, expect} = act;
  return (what === undefined || (typeof what === 'string' && what.length))
  && toolIDs.includes(which)
  && (name === undefined || (typeof name === 'string' && name.length))
  && (isValidTarget(target) || (target === undefined && report.target))
  && (
    rules === undefined
    || Array.isArray(rules)
    && rules.every(rule => typeof rule === 'string')
    && areValidRules(which, rules)
  )
  && (
    expect === undefined
    || Array.isArray(expect) && expect.every(
      expectation => Array.isArray(expectation)
      && (
        expectation.length === 1 || (
          expectation.length === 3
          && typeof expectation[0] === 'string'
          && expectation[0].length
          && ['<', '=', '>', '!', 'i', 'e'].some(operator => expectation[1] === operator)
          && ['string', 'number'].some(type => typeof expectation[2] === type)
        )
      )
    )
  )
  && isValidSpecialToolAct(act);
};
// Returns whether an act is valid.
const isValidAct = (report, actIndex) => {
  const act = report.acts && report.acts[actIndex];
  if (typeof act === 'object') {
    const {type} = act;
    if (type === 'branch') {
      return isValidBranchAct(report, actIndex);
    }
    else if (type === 'tool') {
      return isValidToolAct(act);
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
};
// Returns blank if a job is valid, or an error message.
exports.isValidJob = job => {
  // If any job was provided:
  if (job) {
    // Get its properties.
    const {
      id,
      strict,
      standard,
      observe,
      device,
      browserID,
      timeLimit,
      creationTimeStamp,
      executionTimeStamp,
      target,
      sources,
      acts
    } = job;
    // Return an error for the first missing or invalid property.
    if (! id || typeof id !== 'string') {
      return 'Bad job ID';
    }
    if (typeof strict !== 'boolean') {
      return 'Bad job strict';
    }
    if (! ['also', 'only', 'no'].includes(standard)) {
      return 'Bad job standard';
    }
    if (typeof observe !== 'boolean') {
      return 'Bad job observe';
    }
    if (! isDeviceID(device.id)) {
      return 'Bad job deviceID';
    }
    if (! isBrowserID(browserID)) {
      return 'Bad job browserID';
    }
    if (typeof timeLimit !== 'number' || timeLimit < 1) {
      return 'Bad job timeLimit';
    }
    if (
      ! (creationTimeStamp && typeof creationTimeStamp === 'string' && dateOf(creationTimeStamp))
    ) {
      return 'bad job creationTimeStamp';
    }
    if (
      ! (executionTimeStamp && typeof executionTimeStamp === 'string') && dateOf(executionTimeStamp)
    ) {
      return 'bad job executionTimeStamp';
    }
    if (typeof target !== 'object' || target.url && ! isURL(target.url) || target.what === '') {
      return 'bad job target';
    }
    if (sources && typeof sources !== 'object') {
      return 'Bad job sources';
    }
    if (
      ! acts
      || ! Array.isArray(acts)
      || ! acts.length
      || ! acts.every(act => act.type && typeof act.type === 'string')
    ) {
      return 'Bad job acts';
    }
    const invalidAct = acts.find(act => ! isValidAct(act));
    if (invalidAct) {
      return `Invalid act:\n${JSON.stringify(invalidAct, null, 2)}`;
    }
    return '';
  }
  // Otherwise, i.e. if no job was provided:
  else {
    // Return this.
    return 'no job';
  }
};
