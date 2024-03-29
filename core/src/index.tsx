import { useCallback, useEffect, useState, forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FrameContext } from './Context';

export { FrameContext, useFrame } from './Context';

export interface IFrameProps
  extends React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement> {
  /**
   * The `head` prop is a dom node that gets inserted before the children of the frame.
   */
  head?: React.ReactNode;
  /**
   * The `initialContent` props is the initial html injected into frame.
   * It is only injected once,
   * but allows you to insert any html into the frame (e.g. a [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) tag, [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) tags, etc).
   * Note that it does not update if you change the prop.
   *
   * Defaults to `<!DOCTYPE html><html><head></head><body></body></html>`
   */
  initialContent?: string;
  /**
   * The `mountTarget` attribute is a css selector (`#target`/`.target`) that specifies the child within the initial content of the iframe to be mounted.
   */
  mountTarget?: string;
}

const IFrame = forwardRef<HTMLIFrameElement, IFrameProps>(
  ({ children, head, initialContent, src, mountTarget, ...other }, ref) => {
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [mountNode, setMountNode] = useState<HTMLIFrameElement>();
    const refContent = (node: HTMLIFrameElement) => {
      if (node) {
        setMountNode(node);
      }
    };

    useImperativeHandle(ref, () => mountNode!, [mountNode]);

    const html = initialContent || `<!DOCTYPE html><html><head></head><body></body></html>`;
    const getDoc = () => (mountNode ? mountNode.contentDocument : null);
    const getMountTarget = () => {
      const doc = getDoc();
      if (mountTarget) {
        return doc?.querySelector(mountTarget);
      }
      return doc?.body;
    };
    const evnRef = useRef<React.SyntheticEvent<HTMLIFrameElement, Event>>();
    const handleLoad = useCallback<(evn: React.SyntheticEvent<HTMLIFrameElement, Event> | Event) => void>(
      (evn) => {
        evnRef.current = evn as React.SyntheticEvent<HTMLIFrameElement, Event>;
        /**
         * In certain situations on a cold cache DOMContentLoaded never gets called
         * fallback to an interval to check if that's the case
         */
        const loadCheck = () => setInterval(() => handleLoad(evn), 500);
        clearInterval(loadCheck());
        // Bail update as some browsers will trigger on both DOMContentLoaded & onLoad ala firefox
        if (!iframeLoaded) {
          setIframeLoaded(true);
        }
      },
      [iframeLoaded],
    );

    useMemo(() => {
      if (!src && other.onLoad && iframeLoaded) {
        other.onLoad(evnRef.current!);
      }
    }, [iframeLoaded]);

    useEffect(() => {
      if (mountNode && !src) {
        mountNode.contentWindow?.addEventListener('DOMContentLoaded', handleLoad);
      }
      return () => {
        if (mountNode && !src) {
          mountNode.contentWindow?.removeEventListener('DOMContentLoaded', handleLoad);
        }
      };
    }, [mountNode, handleLoad]);

    const renderFrameContents = () => {
      const doc = getDoc();
      const header = getDoc()?.head;
      const mountTarget = getMountTarget();
      // @ts-ignore
      const win = doc?.defaultView || doc?.parentView;
      const contents = <FrameContext.Provider value={{ document: doc, window: win }}>{children}</FrameContext.Provider>;
      return [
        header && head && createPortal(head, header),
        mountNode && mountTarget && createPortal(contents, mountTarget),
      ];
    };
    const reProps: IFrameProps = {};
    if (src) {
      delete reProps.srcDoc;
      reProps.src = src;
      reProps.onLoad = other.onLoad;
    } else {
      reProps.srcDoc = html;
    }
    return (
      <iframe title={other.title} ref={refContent} {...other} onLoad={handleLoad} {...reProps}>
        {iframeLoaded && renderFrameContents()}
      </iframe>
    );
  },
);

IFrame.displayName = 'IFrame';

export default IFrame;
