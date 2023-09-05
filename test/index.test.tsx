import renderer from 'react-test-renderer';
import { render, waitFor, renderHook, act } from '@testing-library/react';
import IFrame, { useFrame, FrameContext } from '../core/src';
import React from 'react';

it('renders <IFrame /> test case', () => {
  const component = renderer.create(
    <IFrame />,
  );
  const tree = component.toJSON();
  expect(!!tree).toBeTruthy();
  expect(tree).toHaveProperty('type', 'iframe');
  expect(tree).toHaveProperty('props');
  expect(tree).toHaveProperty('children');
  expect(tree).toHaveProperty('props.title', undefined);
  expect(tree).toHaveProperty('props.srcDoc', '<!DOCTYPE html><html><head></head><body></body></html>');
});

it('renders <IFrame /> test case', async () => {
  const { container } = render(
    <IFrame>
      <h1>Hello World!</h1>
    </IFrame>
  );
  await waitFor(() => {
    expect(container.innerHTML).toEqual(`<iframe srcdoc="<!DOCTYPE html><html><head></head><body></body></html>"></iframe>`);
  })
});

it('renders useFrame test case', async () => {
  const { result } = renderHook(() => useFrame());
  act(() => {
    expect(Object.keys(result.current)).toEqual(["document", "window"]);
  });
});


it('renders ref test case', async () => {
  const ref = React.createRef<HTMLIFrameElement>();
  const { container } = render(
    <IFrame ref={ref}>
      <h1>Hello World!</h1>
    </IFrame>
  );
  await waitFor(() => {
    expect(ref.current instanceof HTMLIFrameElement).toBeTruthy();
    expect(container.innerHTML).toEqual(`<iframe srcdoc="<!DOCTYPE html><html><head></head><body></body></html>"></iframe>`);
  })
});


it('renders <IFrame src="https://wangchujiang.com/" /> test case', async () => {
  const { container } = render(
    <IFrame src="https://wangchujiang.com/">
      <h1>Hello World!</h1>
    </IFrame>
  );
  await waitFor(() => {
    expect(container.innerHTML).toEqual(`<iframe src="https://wangchujiang.com/"></iframe>`);
  })
});


it('renders <IFrame head="..." /> test case', async () => {
  const head = (
    <style>{`body { background: red; }`}</style>
  );
  const ref = React.createRef<HTMLIFrameElement>();
  const { container } = render(
    <IFrame ref={ref} head={head}>
      <FrameContext.Consumer>
        {({ document, window }) => {
          return (
            <div>
              <div>Hello World!</div>
            </div>
          )
        }}
      </FrameContext.Consumer>
    </IFrame>
  );
  await waitFor(() => {
    expect(container.innerHTML).toEqual(`<iframe srcdoc="<!DOCTYPE html><html><head></head><body></body></html>"></iframe>`);
  });
});