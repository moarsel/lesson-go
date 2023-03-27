export const getURL = () => {
  if (process?.env?.NEXT_PUBLIC_URL) {
    return process?.env?.NEXT_PUBLIC_URL;
  } else if (process?.env?.NEXT_PUBLIC_VERCEL_URL) {
    const url = process?.env?.NEXT_PUBLIC_VERCEL_URL;
    return url.includes("http") ? url : `https://${url}`;
  } else {
    return "http://localhost:3000";
  }
};

export const postData = async <T>({
  url,
  token,
  data,
}: {
  url: string;
  data?: any;
  token?: string;
}): Promise<T> => {
  const res: Response = await fetch(url, {
    method: "POST",
    headers: new Headers(
      token
        ? { "Content-Type": "application/json", token }
        : { "Content-Type": "application/json" }
    ),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    console.log("Error in postData", err, { url, token, data, res });
    throw Error(err.message || err.error.message || res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};
