
export const jsonDisplay = (json) => {
  let keyVals = "";
  for (const key in json) {
    keyVals += `<div><b>${key}</b>: ${json[key]}</div>`;
  }
  return `
    <div>
      ${keyVals}
    </div>
  `;
}
