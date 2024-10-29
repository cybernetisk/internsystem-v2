
export default async function prismaRequest({
  model,
  method = "",
  request = {},
  callback = () => {},
  fields = false,
  debug = false,
}) {
  
  const response = await fetch("/api/v1/data/prisma", {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      method: method,
      request: request,
      fields: fields,
      debug: debug,
    }),
  });

  if (!response.ok) {
    if (debug) console.log("prismaRequest ERROR:", response)
    return { ok: response.ok, error: response.error };
  }
  
  const data = await response.json();
  
  if (debug) console.log(`prismaRequest ${model}:`, data);
  
  callback({ ok: response.ok, ...data });
  return { ok: response.ok, ...data  }
}