react-iframe
===

[![Build & Deploy](https://github.com/uiwjs/react-iframe/actions/workflows/ci.yml/badge.svg)](https://github.com/uiwjs/react-iframe/actions/workflows/ci.yml)
[![Coverage Status](https://uiwjs.github.io/react-iframe/badges.svg)](https://uiwjs.github.io/react-iframe/coverage/lcov-report/)
[![npm version](https://img.shields.io/npm/v/@uiw/react-iframe.svg)](https://www.npmjs.com/package/@uiw/react-iframe)

This component allows you to wrap your entire React application or each component in an [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe).

## Installation

```bash
npm i @uiw/react-iframe
```

## Basic Usage

```jsx mdx:preview
import React from 'react';
import IFrame from '@uiw/react-iframe';

export default function Demo() {
  return (
    <IFrame>
      <h1>Hello World!</h1>
    </IFrame>
  );
}
```

## `head`

The `head` prop is a dom node that gets inserted before the children of the frame. 

```jsx mdx:preview
import React from 'react';
import IFrame from '@uiw/react-iframe';

const head = (
  <style>{`body { background: red; }`}</style>
);

export default function Demo() {
  return (
    <IFrame head={head}>
      <h1>Hello World!</h1>
    </IFrame>
  );
}
```

## `initialContent`

The `initialContent` props is the initial html injected into frame. It is only injected once, but allows you to insert any html into the frame (e.g. a [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) tag, [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) tags, etc). Note that it does not update if you change the prop. 

Defaults to `<!DOCTYPE html><html><head></head><body></body></html>`

```jsx mdx:preview
import React from 'react';
import IFrame from '@uiw/react-iframe';

const initialContent = '<!DOCTYPE html><html><head><title>React IFrame</title><meta name="keywords" content="react,iframe,component,development" /></head><body></body></html>';

export default function Demo() {
  return (
    <IFrame initialContent={initialContent}>
      <div style={{ fontSize: 32, color: 'red' }}>Hello World!</div>
    </IFrame>
  );
}
```

## `mountTarget`

The `mountTarget` attribute is a css selector (`#target`/`.target`) that specifies the child within the initial content of the iframe to be mounted.

```jsx mdx:preview
import React from 'react';
import IFrame from '@uiw/react-iframe';

const initialContent = '<!DOCTYPE html><html><head></head><body><h1>i wont be changed</h1><div id="mountHere"></div></body></html>';

export default function Demo() {
  return (
    <IFrame initialContent={initialContent} mountTarget="#mountHere">
      <div style={{ fontSize: 32, color: 'red' }}>Hello World!</div>
    </IFrame>
  );
}
```

## `ref`

The ref prop provides a way to access inner [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) DOM node.

```tsx mdx:preview
import React, { useEffect, useState, Fragment } from 'react';
import IFrame from '@uiw/react-iframe';

export default function Demo() {
  const [iframeRef, setIframeRef] = useState();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (iframeRef) {
      iframeRef.focus();
    }
  }, [iframeRef]);

  const click = () => setCount(count + 1);
  return (
    <Fragment>
      <button onClick={click} style={{ display: 'flex' }}>Click</button>
      <IFrame ref={(node) => node && setIframeRef(node)}>
        <div>Hello World!</div>
        <div style={{ fontSize: 32, color: 'red' }}>{count}</div>
      </IFrame>
    </Fragment>
  );
}
```

## `src`

The ref prop provides a way to access inner [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) DOM node.

```tsx mdx:preview
import React, { useEffect, useState, Fragment } from 'react';
import IFrame from '@uiw/react-iframe';

export default function Demo() {
  return (
    <IFrame src="https://wangchujiang.com/" style={{ width: '100%', height: 320 }} />
  );
}
```
## Props

```ts
export interface IFrameProps extends React.HTMLAttributes<HTMLIFrameElement> {
  head?: React.ReactNode;
  initialContent?: string;
  mountTarget?: string;
}
declare const IFrame: import("react").ForwardRefExoticComponent<IFrameProps & import("react").RefAttributes<HTMLIFrameElement>>;
export default IFrame;
```

## Development

Runs the project in development mode.  

```bash
# Step 1, run first, listen to the component compile and output the .js file
# listen for compilation output type .d.ts file
npm run watch
# Step 2, development mode, listen to compile preview website instance
npm run start
```

Builds the app for production to the build folder.

```bash
npm run build
```

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!


## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/uiwjs/react-iframe/graphs/contributors">
  <img src="https://uiwjs.github.io/react-iframe/CONTRIBUTORS.svg" />
</a>

Made with [contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the MIT License.