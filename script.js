const municipalityDataUrl =
  'https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff';
const employmentDataURL =
  'https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065';

async function fetchJsonData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Fetched dataset isn't JSON!");
    }
    return await response.json();
  } catch (err) {
    console.error(
      `Error occurred in fetch function | ${err.name}: ${err.message}`
    );
  }
}
function fillTableWithData(munPopData, employData) {
  const municipality = munPopData.dataset.dimension.Alue.category.label;
  const population = munPopData.dataset.value;
  const employment = employData.dataset.value;
  let fragment = document.createDocumentFragment();
  Object.values(municipality).forEach((mun, index) => {
    const curPop = population[index];
    const curEmp = employment[index];
    const employRate = curEmp / curPop;
    const roundedEmployRate = (employRate * 100).toFixed(2);
    let tRow = createTableRowElem(mun, curPop, curEmp, roundedEmployRate);
    if (employRate > 0.45) tRow.style.backgroundColor = '#abffbd';
    if (employRate < 0.25) tRow.style.backgroundColor = '#ff9e9e';
    fragment.appendChild(tRow);
  });
  document.querySelector('tbody').appendChild(fragment);
}
function createTableRowElem(...textArgs) {
  let tRow = document.createElement('tr');
  for (let arg of textArgs) {
    let tCol = document.createElement('td');
    tCol.innerText = arg;
    tRow.appendChild(tCol);
  }
  return tRow;
}

window.onload = async () => {
  const munPopData = await fetchJsonData(municipalityDataUrl);
  const employData = await fetchJsonData(employmentDataURL);
  fillTableWithData(munPopData, employData);
};
