This is the complete source code for Puru Vijay's personal site/blog/portfolio [puruvj.dev](https://puruvj.dev).

# License

This project MIT License and you may use it as you deem fit.

# Stack

## Frontend packages

- Svelte
- Sapper
- [@mdi/js](https://www.npmjs.com/package/@mdi/js)
- [lazysizes](https://www.npmjs.com/package/lazysizes)
- [throttle-debounce](https://www.npmjs.com/package/throttle-debounce)

## Backend:

- Firebase Functions
- Firebase Firestore for storage

## Hosting;

Hosted on **Vercel**. Deployments happen with a simple `git push`

**Cloudflare** as caching and Analytics proxy.

# Features

📝 Blog posts stored as local `Markdown` files \
🤹‍♀️ Series blog posts supported \
🚀 Highly performant. JavaScript bundle < **28KB** Brotli \
📷 Image optimization

- [JPEG/PNG to WebP conversion, responsive images](https://puruvj.dev/blog/how-i-created-personal-site-part-3)

- [GIF to mp4](https://puruvj.dev/blog/gif-to-mp4-ffmpeg-fluent-web) for higher performance.

🎨 Theming - Light, Midday, Dark. Transitions between are animated. Uses CSS variables for this purpose \

![Theming demo](static/readme/theming.gif)

🎭 Different colored favicon for different themes\
🎏 Responsive. Adapts to screen size gracefully \
🚨 Uses different favicon for development

# Getting Started

### 1. Clone

```bash
git clone https://github.com/puruvj/puruvjdev2.git YOUR_FOLDER_NAME
```

### 2. Install dependencies

```bash
cd YOUR_FOLDER_NAME
npm install

cd api
npm install
```

`api` folder has the backend logic(`Like` blog post functionality)

### 3. Delete blog posts and media

Cloning it will download blog posts, works and media that I have written and used. Delete those

- Delete posts inside `src/blog`
- Delete everything inside `static/media`, `static/works`

### Firebase Project

If you want to keep the `Like` button for your blog posts, you need to set up a firebase project.

Go to https://console.firebase.google.com, create your project.

Now download the private Service key for your project. [Instructions here](https://firebase.google.com/docs/admin/setup#initialize-sdk)

### Set up Vercel

I use Vercel for the ease of use and integration between frontend and backend it provides. All your functions are available in the `api` folder. Invoking them is as simple as requesting `/api/get-likes?blogID=ID`. No `Cors` issues.

You can set up another serverless service like AWS or firebase functions, but that will require a lot extra steps which I can't document here
