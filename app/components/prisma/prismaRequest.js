
/**
 * 
 * @param {*} body an object containing model, method and request
 * @returns 
 */
export async function prismaRequest(body) {
  
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
  
  return data.data
}