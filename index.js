window.onload = async () => {
  const municipalityDataUrl =
    "https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff";
  const employmentDataURL =
    "https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065";
  try {
    const [munPopData, employData] = await Promise.all([
      fetchJsonData(municipalityDataUrl),
      fetchJsonData(employmentDataURL),
    ]);
    fillTableWithData(munPopData, employData);
  } catch (error) {
    console.error(`Data loading failed: ${error.message}`);
  }
};

async function fetchJsonData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new TypeError("Fetched dataset isn't JSON!");
  }
    return await response.json();
}

function fillTableWithData(munPopData, employData) {
  const  municipalities = Object.values(munPopData.dataset.dimension.Alue.category.label);
  const populations = munPopData.dataset.value;
  const employments = employData.dataset.value;
  // Create document fragment to accumulate rows
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < municipalities.length; i++) {
    const employmentRate = calculateEmploymentRate(employments[i], populations[i]);
    const tRow = createTableRowElem(
      municipalities[i],
      populations[i],
      employments[i],
      `${employmentRate}%`
    );
    styleTableRow(tRow, employmentRate);
    fragment.appendChild(tRow);
    
  }
  document.querySelector('tbody').appendChild(fragment);
}

function calculateEmploymentRate(employment, population) {
  // Calculate employment rate as percentage
  return ((employment / population ) * 100).toFixed(2);
}

function styleTableRow(row, employmentRate) {
  if (employmentRate > 45) row.style.backgroundColor = "#abffbd";
  else if (employmentRate < 25) row.style.backgroundColor = "#ff9e9e";
}

function createTableRowElem(...textArgs) {
  let tRow = document.createElement("tr");
  textArgs.forEach((text) => {
    const tCol = document.createElement("td");
    tCol.innerText = text;
    tRow.appendChild(tCol);
  });
  return tRow;
}
