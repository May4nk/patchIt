describe("Check Popular page for request response, errors & loading", () => {
  //errors
  it("should display a loading icon while error or loading of popular cards", () => {
    cy.intercept("POST", "/", (req) => {
      if (req.body.operationName === "ListPopularCards") {
        req.reply({
          errors: [{ message: "Mock GraphQL error 500: Failed to fetch" }],
        });
      }
    });

    cy.visit("http://localhost:3000/");

    cy.get(".loadingwrapper").contains("Redirecting...");
  });

  it("should display a loading icon while error or loading only for popular posts when cards are fetched already", () => {
    cy.intercept("POST", "/", (req) => {
      if (req.body.operationName === "ListPosts") {
        req.reply({
          errors: [
            { message: "Mock GraphQL error 500: Internal server error" },
          ],
        });
      }
    });

    cy.visit("http://localhost:3000/");

    cy.get(".loadingwrapper").contains("Redirecting...");
  });

  //success
  it.only("should display popular cards when data is fetched & check for post are linked to their page", () => {
    const expectedLinks = ["/post/1", "/post/2", "/post/4", "/post/5"];

    cy.intercept("POST", "/", (req) => {
      const { operationName, variables } = req.body;

      if (operationName === "ListPopularCards" && variables.limit === 4) {
        req.reply({ fixture: "popularcards.json" });
      }
    });

    cy.visit("http://localhost:3000/");

    cy.get(".popularpagecards > .popularpostcard")
      .should("have.length", expectedLinks.length)
      .each((card, index) => {
        cy.wrap(card).should("have.attr", "href", expectedLinks[index]);
      });
  });

  it("should display popular posts when data is fetched", () => {
    cy.intercept("POST", "/", (req) => {
      if (req.body.operationName.includes("ListPosts")) {
        req.reply({ fixture: "listposts.json" });
      }
    });

    cy.visit("http://localhost:3000/");

    cy.get(".patchcontent > .post").should("have.length", 2);
  });
});

// describe("Popular", () => {
//   beforeEach(() => {
//     cy.visit("http://localhost:3000");
//   });

// it("should update the sort order when Sortpanel is interacted with", () => {
//   cy.intercept("POST", "/graphql", (req) => {
//     if (req.body.operationName === "GETALLPOSTS") {
//       req.reply({
//         statusCode: 200,
//         body: {
//           data: {
//             listPosts: [
//               { id: "1", title: "Post 1", content: "Content 1" },
//               { id: "2", title: "Post 2", content: "Content 2" },
//             ],
//           },
//         },
//       });
//     }

//     if (req.body.operationName === "GETPOPULARCARDPOSTS") {
//       req.reply({
//         statusCode: 200,
//         body: {
//           data: {
//             listPosts: [
//               { id: "1", title: "Card Post 1", content: "Content 1" },
//               { id: "2", title: "Card Post 2", content: "Content 2" },
//             ],
//           },
//         },
//       });
//     }
//   });

//   cy.get(".sort-panel-button").click();

//   cy.get(".patchcontent").should("contain", "Post 1");
//   cy.get(".patchcontent").should("contain", "Post 2");
// });
// });

export {};
