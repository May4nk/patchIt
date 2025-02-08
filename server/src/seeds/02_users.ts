import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users")
    .del()
    .then(function () {
      return knex("users").insert([
        {
          id: "8b47fdd3-c9f2-43b2-88bd-52572db3e2d8",
          email: "carl@gmail.com",
          username: "carl",
          password:
            "$2a$10$xi1MtFA5ZJHV0dxr37dmjeyBLab74BLEk6V6nApxzoK5VJDFqls3K",
        },
        {
          id: "f2ea4ed3-890c-4bd5-a74c-5a3a177c5154",
          email: "dim@gmail.com",
          username: "dim",
          password:
            "$2a$10$Czy08y2rSifXAA1Gs/BxPeWLypWMuZ29pJYC56XouVUBRWkwPF62C",
        },
        {
          id: "dab4643c-8d05-4fa5-91a6-74c637413f3b",
          email: "creep@gmail.com",
          username: "creep",
          password:
            "$2a$10$eYVEvQ5vzOLmmoz8R2470.zkp51lYz8vXdQAF9x.S6INYPSgL5uG6",
        },
        {
          id: "9eb3a588-e263-42f9-a337-6704ade1085e",
          email: "sim@gmail.com",
          username: "sim",
          password:
            "$2a$10$VzSefqLFAA5TZUUc7y1mHOFYTY9tC6yyScF1RklrbDpU2zd5fU4ny",
        },
        {
          id: "388b2ff2-fa0b-4bd9-b90b-73df0abe2300",
          email: "morty@gmail.com",
          username: "morty",
          password:
            "$2a$10$M5VvwZV.WYDvAjQtOXqEEOmVcy/W03j7ApmJDrs1bBF11NGii.VHS",
        },
      ]);
    });

  await knex("user_preferences")
    .del()
    .then(function () {
      return knex("user_preferences").insert([
        { user: "carl" },
        { user: "dim" },
        { user: "creep" },
        { user: "sim" },
        { user: "morty" },
      ]);
    });
}
