import renderer from 'react-test-renderer';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IFrame from '../core/src';

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