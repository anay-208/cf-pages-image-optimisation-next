# CF Images Optimisations with Next.js

This Repo has answers/solutions to all the following questions:
- Next.js image optimisations is not working in Cloudflare pages.
- How to securely configure image optimisations with Cloudflare Pages + Next.js?
- Next.js Cloudflare Image Optimisation is resizing any width.
- Next.js Image Optimisation is not returning webp in Cloudflare Images.




## Introduction

If you tried to deploy nextjs to CF Pages, you definitely realised that image optimisation was not working.

In this tutorial, I'll help you configure image optimisations with **Cloudflare Images**, which has first 1000 image resizes free!


## Table of Contents
- [Why](#why)
- [Steps](#steps)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
    - [Enable Image Transformation for a zone](#enable-image-transformation-for-a-zone)
    - [Create WAF Rules](#create-waf-rules)
    - [Setup Nextjs](#setup-nextjs)
- [FAQs](#faqs)
- [Sources](#sources)
- [Sponsor](#sponsor)


## Why
If you used cloudflare pages, you probably know that Next.js Image optimisation doesn't work there, as Cloudflare only supports edge runtime. This tutorial will guide you how to enable image optimisations.


# Steps

## Prerequisites

- Add a zone to Cloudflare
- Sign Up For Cloudflare Images No Storage Plan

> #### **Warning**
>
> Cloudflare Images is a pay as you go service, and you'll only be billed for image transformed with No storage plan(As of 7th September, 2024). Please See the [pricing here](https://developers.cloudflare.com/images/pricing/).





## Setup


### Enable Image Transformation for a zone


Transformations let you optimize images that are stored outside of Cloudflare Images. Cloudflare will automatically cache every transformed image on our global network so that you store only the original image at your origin.



Before you can enable transformations, you must purchase Cloudflare Images(could be $0 no storage  plan). To use transformations, you will need to enable the feature on each zone:

1. Log in to the [Cloudflare dashboard ↗](https://dash.cloudflare.com/?to=/:account/images/delivery-zones) and select your account.
2. Select the zone where you want to enable transformations.
3. Select Enable.
4. To transform images only from the enabled zone, uncheck Resize images from any origin. This will prevent third parties from resizing images at any origin.

Image Transformations will be enabled for the zone, and images can be transferred by going to `/cdn-cgi/image/{styles}/{path}`

> #### **Good To Know**
>
> `/cdn-cgi` endpoint is automatically added by cloudflare, and it can't be modified. Learn more about it [here](https://developers.cloudflare.com/fundamentals/reference/cdn-cgi-endpoint/)!


> #### **Note**
>
> With Resize images from any origin unchecked, only the initial URL passed will be checked. Any redirect returned will be followed, including if it leaves the zone, and the resulting image will be transformed.





### Create WAF Rules


To Prevent bad actors from resizing images, a WAF rule will be setup, which'll:
- Check if the path starts with `/cdn-cgi/image`
- Check if the `Authorization` token matches the token

An Authorization taken will be directly added to WAF rule, to ensure only you can send requests, and to prevent bad actors from resizing images and increasing your costs.

How the authorization token will work is that, the nextjs app will have a `/media/[...path]/route.ts?w=100&q=75` Which'll check if the width matches the width in the `allowedWidths` array. This array will have the default nextjs widths.

Same goes with quality, its usually `75`

It'll then proceed to send the request to `/cdn-cgi/image/...`, and return the image.


> #### Good To Know
>
> If you're thinking about directly transforming with workers in api route, it won't work. If you create a separate worker to do this, it'll then only work.

To Create the WAF Rule:

1. Go To [Cloudflare Dashboard](<https://dash.cloudflare.com/login>).
2. Select Your Account, then your zone.
3. Click Security > WAF on the sidebar.
4. Click on Custom Rules on the top bar.
5. Give the rule a name & Add The following expression:
```
(http.request.uri.path wildcard "/cdn-cgi/image/*" and all(http.request.headers["authorization"][*] ne "token"))
```
Make sure to replace `token` with a randomly generated token, which can be generated from [https://it-tools.tech/token-generator](https://it-tools.tech/token-generator).
6. Choose the action: Block

### Setup Nextjs

You can either clone this repo, or copy the code in [\[media\]/\[...path\]/route.ts](nextjs-app/src/app/media/[...path]/route.ts)
Make sure to add the necessary env variables as defined in [env.d.ts](nextjs-app/env.d.ts)

You've to perform some additional steps if you copy pasted the code:
- Create a [Loader File](nextjs-app/src/image/loader.ts), which tells nextjs how to handle src url of image
- Add the Loader file in [next.config.mjs](nextjs-app/next.config.mjs)


The default sizes are mentioned [here](<https://nextjs.org/docs/app/api-reference/components/image#devicesizes>)

### Thats It

You using your next/image component anywhere, and it'll transform the images using cf images in **production**!


## Sources

- https://developers.cloudflare.com/images/pricing/
- https://developers.cloudflare.com/fundamentals/reference/cdn-cgi-endpoint/
- https://developers.cloudflare.com/images/get-started/#enable-transformations
- https://nextjs.org/docs/app/api-reference/components/image#devicesizes


## FAQS

### Q: Webp format is not supported in Cloudflare Images No Storage plan. What to do?
A: The only solution I found is that to directly serve webp images. You can convert your images folder(png) file to a images folder(webp) **locally** to acheive that. I've also created a [script for it](/png-to-webp.js).


# Sponsor

If you find this project helpful and would like to support its development, consider sponsoring me:

- [GitHub Sponsors](https://github.com/sponsors/anay-208)
- [Buy Me a Coffee](https://www.buymeacoffee.com/anay.208)

Your support is greatly appreciated!
