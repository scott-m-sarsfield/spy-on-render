import ReactDOM from "react-dom";
import Matchers from "../src/Matchers";
import React from "react";

import ComponentToTest from "./ComponentToTest";
import { propsOnLastRender, propsOnRenderAt } from '../src/helpers';

expect.extend(Matchers);


jest.mock('./ComponentToTest', () => require('../src/index').createComponentSpy());


describe('createComponentSpy', () => {
  let root;
  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  describe('spy', () => {
    it('renders nothing', () => {
      ReactDOM.render(<ComponentToTest />, root);

      expect(root).not.toContain('HOO BOY');
    });
  });

  describe('toHaveBeenRenderedWithProps', () => {
    beforeEach(() => {
      ReactDOM.render(
        <div>
          <ComponentToTest className="smokey-dokey" />
          <ComponentToTest className="hokey-pokey" />
        </div>,
        root
      );
    });

    describe('positive matcher', () => {
      it('matches props', () => {
        expect(ComponentToTest).toHaveBeenRenderedWithProps({
          className: 'smokey-dokey'
        });
      });

      it('errors when props do not match', () => {
        expect(
          () => expect(ComponentToTest).toHaveBeenRenderedWithProps({
            className: 'smokey-tokey'
          })
        ).toThrowError();
      });

      it('errors helpfully when props do not match', () => {
        try {
          expect(ComponentToTest).toHaveBeenRenderedWithProps({
            className: 'smokey-tokey'
          })
        } catch (e) {
          expect(e.message).toMatch(/Expected Component to have been rendered with/);
          expect(e.message).toMatch(/but was rendered with/);
        }
      });
    });

    describe('negative matcher', () => {
      it('can match negative', () => {
        expect(ComponentToTest).not.toHaveBeenRenderedWithProps({
          className: 'stay-wokey'
        });
      });

      it('errors when props do match', () => {
        expect(
          () => expect(ComponentToTest).not.toHaveBeenRenderedWithProps({
            className: 'smokey-dokey'
          })
        ).toThrowError();
      });

      it('errors helpfully when props match', () => {
        try {
          expect(ComponentToTest).not.toHaveBeenRenderedWithProps({
            className: 'smokey-dokey'
          })
        } catch (e) {
          expect(e.message).toMatch(/Expected Component not to have been rendered with/)
        }
      });
    });
  });

  describe('toHaveBeenRendered', () => {
    describe('positive matcher', () => {
      it('passes if component was rendered', () => {
        ReactDOM.render(<ComponentToTest />, root);

        expect(ComponentToTest).toHaveBeenRendered();
      });

      it('errors helpfully if component was not rendered', () => {
        const { pass, message } = Matchers.toHaveBeenRendered(ComponentToTest);

        expect(pass).toEqual(false);
        expect(message()).toMatch(/Expected Component to have been rendered/);
      });
    });

    describe('negative matcher', () => {
      it('passes if component was not rendered', () => {
        expect(ComponentToTest).not.toHaveBeenRendered();
      });

      it('errors helpfully if component was rendered', () => {
        ReactDOM.render(<ComponentToTest />, root);

        const { pass, message } = Matchers.toHaveBeenRendered(ComponentToTest);

        expect(pass).toEqual(true);
        expect(message()).toMatch(/Expected Component not to have been rendered/);
      });
    });
  });

  describe('propsOnLastRender', () => {
    const propsOnFirstRender = {foo: 'bar'};
    const propsOnSecondRender = {foo: 'baz'};

    beforeEach(() => {
      ReactDOM.render(
        <ComponentToTest {...propsOnFirstRender}/>,
        root
      );
    });

    it('returns props from last call to render', () => {
      expect(propsOnLastRender(ComponentToTest)).toEqual(propsOnFirstRender);

      ReactDOM.render(
        <ComponentToTest {...propsOnSecondRender}/>,
        root
      );

      expect(propsOnLastRender(ComponentToTest)).toEqual(propsOnSecondRender);
    });
  });

  describe('propsOnRenderAt', () => {
    const propsOnFirstRender = {foo: 'bar'};
    const propsOnSecondRender = {foo: 'baz'};

    beforeEach(() => {
      ReactDOM.render(
        <div>
          <ComponentToTest {...propsOnFirstRender}/>
          <ComponentToTest {...propsOnSecondRender}/>
        </div>,
        root
      );
    });

    it('returns props from last call to render', () => {
      expect(propsOnRenderAt(ComponentToTest, 0)).toEqual(propsOnFirstRender);
      expect(propsOnRenderAt(ComponentToTest, 1)).toEqual(propsOnSecondRender);
    });
  });
});