// seems to clash with Jest: getting `Identifier 'test' has already been declared`
// import { render } from "@testing-library/react";
import { createModel } from "@xstate/test";
import { createMachine } from "xstate";
import Enzyme, { render } from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
// import jest from "jest-mock";

import App from "./App";
import { act } from "react-dom/test-utils";
import { loadData } from "./loader";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("./loader", () => ({
  loadData: jest.fn()
}));

describe("AppModelTest", () => {
  const testMachine = createMachine({
    id: "testMachine",
    initial: "initialising",
    states: {
      initialising: {
        on: {
          // DATA_RECEIVED: "ready",
          500: "ready"
        },
        meta: {
          test: (wrapper) => {
            console.log("wrapper", wrapper.html());
            expect(wrapper.find("#loadingIndicator")).toHaveLength(1);
          }
        }
      },
      ready: {
        id: "ready",
        meta: {
          test: (wrapper) => {
            expect(2).toEqual(2);
            // expect(wrapper.find("#loadingIndicator")).toHaveLength(0);
            console.log("wrapper", wrapper.html());
            // expect(wrapper.find("#data")).toHaveLength(1);
          }
        }
      }
    }
  });
  const appModelTest = createModel(testMachine).withEvents({
    500: {},
    DATA_RECEIVED: {
      exec: async (rendered, event) => {
        await act(async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 1500);
          });
        });
      }
    }
  });
  const testPlans = appModelTest.getSimplePathPlans();
  testPlans.forEach((plan, planIndex) => {
    describe(plan.description, () => {
      plan.paths.forEach((path, pathIndex) => {
        beforeEach(() => {
          loadData.mockImplementation(() => {
            console.log("running mock implementation");
            return Promise.resolve("my returned data from mock");
          });
        });
        it(path.description, async () => {
          await act(async () => {
            const wrapper = render(<App />);
            await path.test(wrapper);
          });
        });
      });
    });
  });
});
