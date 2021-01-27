---
title: '"declare"ing my undying ❤ love for TypeScript'
description: TypeScript is cool. Super cool. It's made us Web Dev's life super easy. Read me being a fanboy about it.
date: 1 Feb, 2021
cover_image: media/declaring-my-undying-love-for-typescript-sun-love.jpg
---

![Love sunset](../../static/media/declaring-my-undying-love-for-typescript-sun-love.jpg)

Alrighty! So, a fair warning before you jump on to the rest of the article: You probably won't learn any TypeScript related thing in this article. You may or you may not, I can't really say.

What I can say is that you are gonna enjoy the hell out of this article. Me being a huge fanboy about TypeScript might just make your day.

# Disclaimer

I come from a JavaScript and PHP background, so I don't have any statically typed language experience from before like C, Java, or C++. Some things that I might find great or magical about TypeScript, might be super normal or even a bit irritating if you're coming from one of these classic typed languages. This article is just a huge opinion. Opinions differ. So I implore you to just ignore that part and move on.

# What is TypeScript?

In case you aren't familiar with TypeScript, it simply adds <mark>static type checking</mark> to your code, and that's what makes all the difference in the world. Check out this snippet

```js
function sum(a, b) {
  return a + b;
}

document.querySelector('#submit').addEventListener('click', () => {
  const val1 = document.querySelector('#input1').value;
  const val2 = document.querySelector('#input2').value;

  console.log(sum(val1, val2));
});
```

Here we have a `sum` function declared, which will take two variables and return their sum. Then we have 2 inputs where you enter numbers. Then there's a submit button, which `onclick`, gets values of these 2 inputs and pass the input values to our `sum` functions, and `console.log` that value.

So let's consider this 👇

![Weird input sum values](../../static/media/declaring-my-undying-love-for-typescript-code-sample-1.gif)

So when inputs are 2 and 8, their sum is 28. When values are 89, and 1, we get 891. Weird huh?

So here's what's happening. Instead of actually summing those numbers, javascript is actually concatenating those 2 numbers as if they are strings

```js
'2' + '8' = '28';
```

Well, this happens because `input.value` always returns a string, no matter if it is input `type="number"`.

It's easy to fix it. We just have to put a `+` sign in our values:

```js
const val1 = +document.querySelector('#input1').value;
```

This `+` will convert the incoming value from the input to number, if it can, otherwise it will turn it into `NaN`. Luckily in out case, it will convert those values to `2` and `8` as numbers, respectively, and we'll get the correct answer, `10`

This saved us in the end, but what if it was much more complex codebase, and a dev forgot to fix it, and shipped it to production? Ooh, whatever would happened, it would make headlines in HackerNews and Twitter 😂.

This where TypeScript comes in handy. Consider the above code's equivalent in TypeScript:

```js
function sum(a: number, b: number) {
  return a + b;
}

document.querySelector('#submit').addEventListener('click', () => {
  const val1 = (document.querySelector('#input1') as HTMLInputElement).value;
  const val2 = (document.querySelector('#input2') as HTMLInputElement).value;

  console.log(sum(val1, val2));
});
```

We added the type `number` to out parameters in `sum` function, used `as` keyword to say that the element selected is actually an `input` element. But our code editor shows an error here.

![Weird input sum values error](../../static/media/declaring-my-undying-love-for-typescript-code-sample-2.gif)

See, Typescript is giving us an error that we can't put a `string` where a `number` was expected. It took the guessing game out of the equation completely, and saved us a lot of time later when the we would be looking in the whole codebase for the issue.
