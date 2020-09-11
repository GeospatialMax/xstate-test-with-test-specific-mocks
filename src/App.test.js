import { createModel } from "@xstate/test";
import { createMachine, assign } from "xstate";
import React from "react";
import { render, getNodeText } from "@testing-library/react";
import { act } from "react-dom/test-utils";


import App from "./App";
import { loadData } from "./loader";


jest.mock("./loader", () => ({
  loadData: jest.fn()
}));

describe("AppModelTest", () => {
  const testMachine = createMachine({
    id: "testMachine",
    initial: "initialising",
    context: {
      data: null
    },
    states: {
      initialising: {
        on: {
          DATA_RECEIVED: {
            target:"ready",
            actions: "storeData",
          }
        },
        meta: {
          test: (rendered) => {
            expect(rendered.getByTestId("loadingIndicator")).toBeDefined();
          }
        }
      },
      ready: {
        id: "ready",
        meta: {
          test: ({queryByTestId, getByTestId, debug}, machine) => {
            console.log('data from context', machine.context.data)
            const dataNode = getByTestId("data");
            console.log(debug())
            const textContent = getNodeText(dataNode);
            expect(queryByTestId("loadingIndicator")).toBeNull();

            // this will fail
            expect(textContent).toEqual(machine.context.data)
            expect(getByTestId("data")).toBeDefined();
          }
        }
      }
    }
  }, {
    actions: {
      storeData: assign({
        data: (_, event) => event.data
      })
    },
  });
  const appModelTest = createModel(testMachine).withEvents({
    DATA_RECEIVED: {
      exec: async (rendered, event) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 20);
        });
      }, 
      cases: [{data: 'some text data'}, {data: 'some other text data'}]
    }
  });

  const testPlans = appModelTest.getSimplePathPlans();
  testPlans.forEach((plan, planIndex) => {
    describe(plan.description, () => {
      plan.paths.forEach((path, pathIndex) => {
        beforeEach(() => {
          
          const eventData = path.segments[0]?.event.data;
          if(typeof eventData !== 'undefined') {
            loadData.mockImplementation(() => {
              console.log("running mock implementation");
              return Promise.resolve(eventData);
            });
          }
        });
        it(path.description, async () => {
          await act(async () => {
            const rendered = render(<App />);
            await path.test(rendered);
          });
        });
      });
    });
  });
});
