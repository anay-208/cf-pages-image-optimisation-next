import { NextRequest, NextResponse } from "next/server";
// taken from https://nextjs.org/docs/app/api-reference/components/image#devicesizes
const defaultDeviceSizes = [16, 32, 48, 64, 96, 128, 256, 384];
const defaultImageSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const allowedWidths = [...defaultDeviceSizes, ...defaultImageSizes];

interface Props {
  params: {
    path: string[];
  };
}

function parseImageParams(
  params: Record<string, string | number | undefined>
): string {
  return (
    Object.entries(params)
      // If 0, it won't be added
      .filter(([_, value]) => !!value)
      .map(([key, value]) => `${key}=${value}`)
      .join(",")
  );
}

export async function GET(req: NextRequest, { params }: Props) {
  if (!process.env.IMAGE_OPTIMIZATION_TOKEN || !process.env.CF_ZONE_URI) {
    console.error(
      "%cEnvironment Variable IMAGE_OPTIMIZATION_TOKEN or CF_ZONE_URI is not set, requests won't be processed.",
      "color: red"
    );
    return new Response("Internal Server Error", { status: 500 });
  }
  const path = params.path.join("/");
  const searchParams = req.nextUrl.searchParams;
  let width = parseInt(searchParams.get("width") ?? "0");
  let quality = parseInt(searchParams.get("quality") ?? "100");
  let blur = parseInt(searchParams.get("blur") ?? "0");
  //   validate blur
  if (blur && !(blur === 75 || blur === 0)) {
    if (blur > 25) blur = 75;
    else blur = 0;
  }

  // validate quality
  if (quality && ![75, 90, 100].includes(quality)) {
    quality = 75;
  }

  //   validate width and if the width isn't a valid, round it off to the nearest
  if (width) {
    if (!allowedWidths.includes(width)) {
      // Find the nearest width
      const nearestWidth = allowedWidths.reduce((prev, curr) =>
        Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
      );
      width = nearestWidth;
    }
  }

  // https://developers.cloudflare.com/images/transform-images/transform-via-url/
  const addSlash = process.env.CF_ZONE_URI.endsWith("/") ? "" : "/";
  const url = `${
    process.env.CF_ZONE_URI + addSlash
  }cdn-cgi/image/${parseImageParams({ width, quality, blur })}/${path}`;
  const response = await fetch(url, {
    headers: {
      // A custom one with WAF rules
      authorization: process.env.IMAGE_OPTIMIZATION_TOKEN,
    },
  });
  if (!response.ok) {
    return new Response("Not found");
  }
  return new Response(response.body, {
    headers: response.headers,
  });
}
