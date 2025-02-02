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

/*
  actSpecs
  Validator for acts of a job.
*/

exports.actSpecs = {
  etc: {
    next: [
      'Specify the next command if the last result requires',
      {
        if: [
          true, 'array', '', 'act result property tree in a.b.c format; if to exist, also one of “<=>!” and criterion'
        ],
        jump: [false, 'number', '', 'offset of next command from this one, or 0 to stop'],
        next: [false, 'string', 'hasLength', 'name of next command'],
        what: [false, 'string', 'hasLength', 'comment']
      }
    ],
    tool: [
      'Perform tests of a tool',
      {
        which: [true, 'string', 'isTest', 'tool name'],
        launch: [false, 'object', '', 'if new browser to be launched, properties different from target, browserID, and what of the job'],
        rules: [false, 'array', 'areStrings', 'rule IDs or (for nuVal) specifications, if not all']
      }
    ]
  },
  tools: {
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
