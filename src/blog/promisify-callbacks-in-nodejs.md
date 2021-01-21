---
title: Bye bye Callbacks, hi Promises in NodeJS
description: Completely get rid of callbacks in NodeJS and replace them with the great Promises.
date: 25 Jan 2021 12:00 AM
cover_img: media/promisify-callbacks-in-nodejs-promises-everywhere.jpg
---

![Promise, promises everywhere](../../static/media/promisify-callbacks-in-nodejs-promises-everywhere.jpg)

These is gonna be a meme-tastic blog post. Strap yourself in.

So, I guess you read the [super]clickbaity title, and couldn't resist it, huh? Well, no worries, I **promise** you 😁 this is gonna be good.

# History lesson 😴

NodeJS initially shipped with callbacks for it's amazing asynchronous model which made it an overnight star in the first place. And callbacks were cool. You could read a huge file, and write the code in such a way to simply wait for the response to come out. This applied to database reads, XHR calls(ajax). This model was groundbreaking when it came out.

Callbacks follow this pattern 👇

```js
callback(param1, param2, param3, (error, data)) {
  // Do something
}
```

Note, there can be any number of parameters before the actual callback as the last parameter, and the callback doesn't have to have only `data` either, it can be any number of parameters, or not have any, other than the `error`.

But there's a funny thing that happens when you dive super deep into something. **YoU fInD oUt ItS fLaWs.** 👇

```js
fs.readdir(source, function (err, files) {
  if (err) {
    console.log('Error finding files: ' + err);
  } else {
    files.forEach(function (filename, fileIndex) {
      console.log(filename);
      gm(source + filename).size(function (err, values) {
        if (err) {
          console.log('Error identifying file size: ' + err);
        } else {
          console.log(filename + ' : ' + values);
          aspect = values.width / values.height;
          widths.forEach(
            function (width, widthIndex) {
              height = Math.round(width / aspect);
              console.log('resizing ' + filename + 'to ' + height + 'x' + height);
              this.resize(width, height).write(dest + 'w' + width + '_' + filename, function (err) {
                if (err) console.log('Error writing file: ' + err);
              });
            }.bind(this)
          );
        }
      });
    });
  }
});
```

Oh boy, my eyes bleed 🙈

I guess this twitter meme is on point 👇

![Goku pushing callbacks](../../static/media/promisify-callbacks-in-nodejs-goku-meme.gif)

# Enter promises

Promises radicalized the whole scene. They made our code even cleaner. They follow a much simpler tructure
