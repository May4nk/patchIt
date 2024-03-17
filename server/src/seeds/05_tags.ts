import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("tags").del()
    .then(function() {
      return knex("tags").insert([
        { name: "NEW" },
        { name: "NSFW" },
        { name: "SPOILERS" },
        { name: "WEIRD" }
      ])    
    });
};
