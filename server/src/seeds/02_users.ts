import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del()
    .then(function() {
      return knex("users").insert([
        { email: "carl@gmail.com", username: "carl", password: "$2a$10$xi1MtFA5ZJHV0dxr37dmjeyBLab74BLEk6V6nApxzoK5VJDFqls3K" },
        { email: "dim@gmail.com", username: "dim", password: "$2a$10$Czy08y2rSifXAA1Gs/BxPeWLypWMuZ29pJYC56XouVUBRWkwPF62C" },
        { email: "creep@gmail.com", username: "creep", password: "$2a$10$eYVEvQ5vzOLmmoz8R2470.zkp51lYz8vXdQAF9x.S6INYPSgL5uG6", role: 0 },
        { email: "sim@gmail.com", username: "sim", password: "$2a$10$VzSefqLFAA5TZUUc7y1mHOFYTY9tC6yyScF1RklrbDpU2zd5fU4ny", role: 1337 },
        { email: "morty@gmail.com", username: "morty", password: "$2a$10$M5VvwZV.WYDvAjQtOXqEEOmVcy/W03j7ApmJDrs1bBF11NGii.VHS", role: 0 },
      ]);    
    });
  
  await knex("user_preferences").del()
    .then(function() {
      return knex("user_preferences").insert([
        { user_id: 1 },
        { user_id: 2 },
        { user_id: 3 },
        { user_id: 4 },
        { user_id: 5 },
      ]);   
    });
};
