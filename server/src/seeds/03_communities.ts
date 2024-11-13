import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("communities")
    .del()
    .then(function () {
      return knex("communities").insert([
        {
          communityname: "rick & morty",
          about: "All things about rick & morty show.",
          privacy: "PUBLIC",
          category: "entertainment",
          owner: 2,
        },
        {
          communityname: "suits",
          about: "All things about suits show.",
          privacy: "PUBLIC",
          category: "entertainment",
          owner: 1,
        },
        {
          communityname: "simpsons",
          about: "All things about simpsons show.",
          privacy: "PUBLIC",
          category: "entertainment",
          owner: 1,
        },
        {
          communityname: "coding",
          about: "Coders meet here",
          privacy: "PUBLIC",
          category: "coding",
          owner: 3,
        },
        {
          communityname: "programing",
          about: "All about computer algorithims or their working",
          privacy: "PUBLIC",
          category: "coding",
          owner: 2,
        },
        {
          communityname: "machine",
          about: "Computer architecture or their models.",
          privacy: "PUBLIC",
          category: "computers",
          owner: 2,
        },
        {
          communityname: "amazon",
          about: "Discount or new products on amazon",
          privacy: "PUBLIC",
          category: "shopping",
          owner: 1,
        },
        {
          communityname: "flipkart",
          about: "New products on flipkart.",
          privacy: "PUBLIC",
          category: "shopping",
          owner: 3,
        },
        {
          communityname: "system architecture",
          about: "About computer architecture and their working.",
          privacy: "PUBLIC",
          category: "computers",
          owner: 4,
        },
        {
          communityname: "stocks",
          about: "Reviews about daily stocks up and down in market.",
          privacy: "PUBLIC",
          category: "finance",
          owner: 3,
        },
        {
          communityname: "taylor swift",
          about: "New albums of taylor swift",
          privacy: "PUBLIC",
          category: "music",
          owner: 3,
        },
        {
          communityname: "cristiano",
          about: "Dedicated to the legend ronaldo",
          privacy: "PUBLIC",
          category: "sports",
          owner: 2,
        },
        {
          communityname: "eminem",
          about: "low-key rap battles",
          privacy: "PUBLIC",
          category: "music",
          owner: 5,
        },
        {
          communityname: "cricket",
          about: "Daily cricket updates",
          privacy: "PUBLIC",
          category: "sports",
          owner: 5,
        },
      ]);
    });

  await knex("community_preferences")
    .del()
    .then(function () {
      return knex("community_preferences").insert([
        { community_name: "rick & morty", handlers: "[2]" },
        { community_name: "suits", handlers: "[1]" },
        { community_name: "simpsons", handlers: "[1]" },
        { community_name: "coding", handlers: "[3]" },
        { community_name: "programing", handlers: "[2]" },
        { community_name: "machine", handlers: "[2]" },
        { community_name: "amazon", handlers: "[1]" },
        { community_name: "flipkart", handlers: "[3]" },
        { community_name: "system architecture", handlers: "[4]" },
        { community_name: "stocks", handlers: "[3]" },
        { community_name: "taylor swift", handlers: "[3]" },
        { community_name: "cristiano", handlers: "[2]" },
        { community_name: "eminem", handlers: "[5]" },
        { community_name: "cricket", handlers: "[5]" },
      ]);
    });
}
