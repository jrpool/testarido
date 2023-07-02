/*
  linkExt
  Related to Tenon rule 218, but stricter.
  This test reports links with target attributes with _blank values, because forcibly external links
  risk miscommunication of the externality and remove control from the user.
*/
exports.reporter = async (page, withItems) => {
  // Identify the links with target=_blank attributes.
  const badLinkData = await page.$$eval(
    'a[target=_blank]',
    badLinks => {
      // FUNCTION DEFINITION START
      // Returns a space-minimized copy of a string.
      const compact = string => string.replace(/[\t\n]/g, ' ').replace(/\s{2,}/g, ' ').trim();
      // FUNCTION DEFINITION END
      return badLinks.map(link => ({
        id: link.id,
        text: compact(link.textContent)
      }));
    }
  );
  const data = {
    total: badLinkData.length
  };
  const totals = [data.total, 0, 0, 0];
  const standardInstances = [];
  if (withItems) {
    data.items = badLinkData;
    data.items.forEach(item => {
      standardInstances.push({
        ruleID: 'linkExt',
        what: 'Link has a target=_blank attribute',
        ordinalSeverity: 0,
        tagName: 'A',
        id: item.id,
        location: {
          doc: '',
          type: '',
          spec: ''
        },
        excerpt: item.text
      });
    });
  }
  else if (data.total) {
    standardInstances.push({
      ruleID: 'linkExt',
      what: 'Links have target=_blank attributes',
      count: data.total,
      ordinalSeverity: 0,
      tagName: 'A',
      id: '',
      location: {
        doc: '',
        type: '',
        spec: ''
      },
      excerpt: ''
    });
  }
  return {
    data,
    totals,
    standardInstances
  };
};
