/*
  © 2021–2024 CVS Health and/or one of its affiliates. All rights reserved.

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

const { accepts } = require("express/lib/request");

/*
  actSpecs
  Validator for acts of a job.
*/

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
// IDs of tools that have nongeneric validity criteria.
const specialTools = ['axe', 'ibm', 'qualweb', 'testarido', 'wave'];
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
  if (specialTools.includes(act.which)) {

  }
};
// Returns whether a tool act is generically valid.
const isValidToolAct = (report, actIndex) => {
  const act = report.acts[actIndex];
  const {what, which, name, target, rules} = act;
  return (what === undefined || (typeof what === 'string' && what.length))
  && toolIDs.includes(which)
  && (name === undefined || (typeof name === 'string' && name.length))
  && (isValidTarget(target) || (target === undefined && report.target))
  && (
    rules === undefined)
    || (Array.isArray(rules) && rules.every(rule => typeof rule === 'string' && rule.length)
  );
};
// Returns whether an act is valid.
exports.isValidAct = (report, actIndex) => {
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

    axe: [
      'Perform Axe tests',
      {
        detailLevel: [true, 'number', '', '0 = least, 4 = most']
      }
    ],
    ibm: [
      'Perform IBM Equal Access tests',
      {
        withItems: [true, 'boolean', '', 'itemize'],
        withNewContent: [
          true, 'boolean', '', 'true: use a URL; false: use page content (risky)'
        ]
      }
    ],
    qualWeb: [
      'Perform QualWeb tests',
      {
        withNewContent: [true, 'boolean', '', 'whether to use a URL instead of page content']
      }
    ],
    testaro: [
      'Perform Testaro tests',
      {
        withItems: [true, 'boolean', '', 'itemize'],
        stopOnFail: [true, 'boolean', '', 'whether testing is to stop after first failure'],
        args: [false, 'object', 'areArrays', 'extra args (object; property names are rule IDs and values are arrays of additional argument values ({autocomplete: [["first name", "forename", "given name"], ["last name", "surname", "family name"], ["email"]], buttonMenu: [], focInd: [false, 250], hover: [20]}) by default'],
      }
    ],
    wave: [
      'Perform WAVE tests',
      {
        reportType: [true, 'number', '', 'WAVE report type (1, 2, 3, or 4)'],
        url: [false, 'isURL', '', 'URL of stand-alone WAVE API'],
        prescript: [false, 'string', '', 'content of pre-load script, if any'],
        postscript: [false, 'string', '', 'content of post-load script, if any']
      }
    ]
  }
};
