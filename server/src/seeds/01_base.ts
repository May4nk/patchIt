import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("categories")
    .del()
    .then(function () {
      return knex("categories").insert([
        { categoryname: "entertainment", categoryicon: "beach_access" },
        { categoryname: "music", categoryicon: "library_music" },
        { categoryname: "coding", categoryicon: "flag" },
        { categoryname: "finance", categoryicon: "trending_up" },
        { categoryname: "nature", categoryicon: "landscape" },
        { categoryname: "sports", categoryicon: "fitness_center" },
        { categoryname: "travel", categoryicon: "flight" },
        { categoryname: "shopping", categoryicon: "local_offer" },
        { categoryname: "computers", categoryicon: "memory" },
      ]);
    });

  await knex("roles")
    .del()
    .then(function () {
      return knex("roles").insert([
        { id: 0, role: "su" },
        { id: 7001, role: "admin" },
        { id: 5339, role: "cm" },
        { id: 9005, role: "user" },
        { id: 1337, role: "anon" },
      ]);
    });
}
