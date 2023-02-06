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
