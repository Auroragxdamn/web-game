import { useRef, type FormEvent } from "react";
import { client } from "../eden";

export function APITester() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const method = formData.get("method") as string;

      let data;
      if (method === "GET") {
        const res = await client.get();
        data = res.data ?? res.error;
      }

      responseInputRef.current!.value = JSON.stringify(data, null, 2);
    } catch (error) {
      responseInputRef.current!.value = String(error);
    }
  };

  return (
    <div className="api-tester">
      <form onSubmit={testEndpoint} className="endpoint-row">
        <select name="method" className="method">
          <option value="GET">GET</option>
        </select>
        <input type="text" name="endpoint" defaultValue="/" className="url-input" readOnly />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
      <textarea ref={responseInputRef} readOnly placeholder="Response will appear here..." className="response-area" />
    </div>
  );
}
