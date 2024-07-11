
/**
 * 
 * @param {*} body an object containing model, method and request
 * @returns 
 */
async function prismaFetch(body) {
  
  const response = await fetch("/api/data/prisma", {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    return { success: false, error: "Unable to connect to database" };
  }

  const data = await response.json();
  
  return data
}

export default async function prismaRequest({
  model,
  method = "",
  request = {},
  callback = () => {},
  fields = false,
  debug = false,
}) {
  
  let data = await prismaFetch({
    model: model,
    method: method,
    request: request,
    fields: fields,
  });
  
  if (debug) console.log(`pR ${model}: request`, model, method, request);
  if (debug) console.log(`pR ${model}: result`, data.data);
  if (debug && fields) console.log(`pR ${model}: fields`, data.fields);

  callback(data);
}