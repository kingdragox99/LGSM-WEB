export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === "GET") {
    // Logique GET
  }

  if (method === "POST") {
    // Logique POST
  }
});
