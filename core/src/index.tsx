import { useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';

export interface IFrameProps
  extends React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement> {
  head?: React.ReactNode;
  initialContent?: string;
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
    const handleLoad = useCallback(() => {
      // In certain situations on a cold cache DOMContentLoaded never gets called
      // fallback to an interval to check if that's the case
      const loadCheck = () => setInterval(() => handleLoad(), 500);
      clearInterval(loadCheck());
      // Bail update as some browsers will trigger on both DOMContentLoaded & onLoad ala firefox
      if (!iframeLoaded) {
        setIframeLoaded(true);
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
      const header = getDoc()?.head;
      const mountTarget = getMountTarget();
      return [
        header && head && createPortal(head, header),
        mountNode && mountTarget && createPortal(children, mountTarget),
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
