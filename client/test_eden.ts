import { client } from "./eden";

async function test() {
  const res = await client.get();
  console.log("Response data:", res.data);
  console.log("Response error:", res.error);
  if (res.error) {
    console.log("Error status:", res.error.status);
    console.log("Error value:", res.error.value);
  }
}

test();
