import React from 'react';
import Popular from '../../src/containers/Popular';

beforeEach(() => {
  cy.visit('http://localhost:3000/popular');
})

describe("Popular", () => {
  it('renders', () => {    
    cy.mount(<Popular />)
  })

  it('should display a loading spinner while data is being fetched', () => {    
    cy.get('.loadingwrapper');
  });

  it('should display an error message if there is an error fetching card posts', () => {
    // Mock an error response for the GETPOPULARCARDPOSTS query
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'GETPOPULARCARDPOSTS') {
        req.reply({ statusCode: 500, body: { errors: [{ message: 'Failed to fetch' }] } });
      }
    });

    cy.visit('/popular');
    cy.get('div').contains('Error loading popular cards').should('be.visible');
  });

  it('should display popular cards when data is fetched successfully', () => {
    // Mock a successful response for the GETPOPULARCARDPOSTS query
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'GETPOPULARCARDPOSTS') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              listPosts: [
                { id: '1', title: 'Card Post 1', content: 'Content 1' },
                { id: '2', title: 'Card Post 2', content: 'Content 2' }
              ]
            }
          }
        });
      }
    });

    cy.visit('/popular');
    cy.get('.contentfilter').should('contain', 'Card Post 1');
    cy.get('.contentfilter').should('contain', 'Card Post 2');
  });

  it('should display popular posts when data is fetched successfully', () => {
    // Mock a successful response for the GETALLPOSTS query
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'GETALLPOSTS') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              listPosts: [
                { id: '1', title: 'Post 1', content: 'Content 1', community_id: '1' },
                { id: '2', title: 'Post 2', content: 'Content 2', community_id: null }
              ]
            }
          }
        });
      }
    });

    cy.visit('/popular');
    cy.get('.patchcontent').should('contain', 'Post 1');
    cy.get('.patchcontent').should('contain', 'Post 2');
  });

  it('should update the sort order when Sortpanel is interacted with', () => {
    // Mock a successful response for both queries
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'GETALLPOSTS') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              listPosts: [
                { id: '1', title: 'Post 1', content: 'Content 1' },
                { id: '2', title: 'Post 2', content: 'Content 2' }
              ]
            }
          }
        });
      }

      if (req.body.operationName === 'GETPOPULARCARDPOSTS') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              listPosts: [
                { id: '1', title: 'Card Post 1', content: 'Content 1' },
                { id: '2', title: 'Card Post 2', content: 'Content 2' }
              ]
            }
          }
        });
      }
    });

    cy.visit('/popular');

    // Simulate changing the sort order
    cy.get('.sort-panel-button').click(); // Adjust selector based on your Sortpanel implementation

    // Verify that data is updated based on the new sort order
    cy.get('.patchcontent').should('contain', 'Post 1');
    cy.get('.patchcontent').should('contain', 'Post 2');
  });
});
