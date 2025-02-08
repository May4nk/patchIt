import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("communities")
    .del()
    .then(function () {
      return knex("communities").insert([
        {
          id: "b854714e-5a63-4a11-a1d3-506dfe7a9e0f",
          name: "rick&morty",
          about: "All things about rick & morty show.",
          privacy: "PUBLIC",
          display_name: "rick & morty",
          category: "entertainment",
          owner: "388b2ff2-fa0b-4bd9-b90b-73df0abe2300",
        },
        {
          id: "de35a8e1-d505-4e59-bbbc-7cfda245303c",
          name: "suits",
          about: "All things about suits show.",
          privacy: "PUBLIC",
          display_name: "suits",
          category: "entertainment",
          owner: "f2ea4ed3-890c-4bd5-a74c-5a3a177c5154",
        },
        {
          id: "56444000-2ff5-4b6d-9b70-a4a53b5ac937",
          name: "simpsons",
          about: "All things about simpsons show.",
          privacy: "PUBLIC",
          display_name: "simpsons",
          category: "entertainment",
          owner: "388b2ff2-fa0b-4bd9-b90b-73df0abe2300",
        },
        {
          id: "2467cfe6-5ce9-4de3-9804-8e2928eee904",
          name: "coding",
          about: "Coders meet here",
          privacy: "PUBLIC",
          display_name: "coding",
          category: "coding",
          owner: "8b47fdd3-c9f2-43b2-88bd-52572db3e2d8",
        },
        {
          id: "eda29417-e99a-4292-8e8d-43779ed4ad62",
          name: "programing",
          about: "All about computer algorithims or their working",
          privacy: "PUBLIC",
          display_name: "programing",
          category: "coding",
          owner: "388b2ff2-fa0b-4bd9-b90b-73df0abe2300",
        },
        {
          id: "5159e489-e256-4895-ba7f-16a6c1a110b0",
          name: "machine",
          display_name: "machine",
          about: "Computer architecture or their models.",
          privacy: "PUBLIC",
          category: "computers",
          owner: "8b47fdd3-c9f2-43b2-88bd-52572db3e2d8",
        },
        {
          id: "ff40ca5e-9907-466f-b3a9-d04bb58c3047",
          name: "amazon",
          display_name: "amazon",
          about: "Discount or new products on amazon",
          privacy: "PRIVATE",
          category: "shopping",
          owner: "f2ea4ed3-890c-4bd5-a74c-5a3a177c5154",
        },
        {
          id: "8b525b01-9326-44bb-8ce0-46fa159159ca",
          name: "flipkart",
          display_name: "flipkart",
          about: "New products on flipkart.",
          privacy: "PUBLIC",
          category: "shopping",
          owner: "dab4643c-8d05-4fa5-91a6-74c637413f3b",
        },
        {
          id: "986eab9b-87aa-4020-8f1b-97615a370156",
          name: "systemArchitecture",
          about: "About computer architecture and their working.",
          privacy: "PUBLIC",
          display_name: "system architecture",
          category: "computers",
          owner: "9eb3a588-e263-42f9-a337-6704ade1085e",
        },
        {
          id: "80cf808c-191d-46f2-a8f7-fa5104691325",
          name: "stocks",
          about: "Reviews about daily stocks up and down in market.",
          privacy: "PUBLIC",
          display_name: "stocks",
          category: "finance",
          owner: "f2ea4ed3-890c-4bd5-a74c-5a3a177c5154",
        },
        {
          id: "66b1397e-7a6e-4cdc-85f5-790a0b5cf90c",
          name: "cristiano",
          display_name: "cristiano",
          about: "Dedicated to the legend ronaldo",
          privacy: "PUBLIC",
          category: "sports",
          owner: "dab4643c-8d05-4fa5-91a6-74c637413f3b",
        },
        {
          id: "dab4643c-8d05-4fa5-91a6-74c637413f3b",
          name: "eminem",
          display_name: "eminem",
          about: "low-key rap battles",
          privacy: "PUBLIC",
          category: "music",
          owner: "9eb3a588-e263-42f9-a337-6704ade1085e",
        },
      ]);
    });

  await knex("community_preferences")
    .del()
    .then(function () {
      return knex("community_preferences").insert([
        {
          community_name: "rick & morty",
          handlers: '["388b2ff2-fa0b-4bd9-b90b-73df0abe2300",]',
        },
        {
          community_name: "suits",
          handlers: '["f2ea4ed3-890c-4bd5-a74c-5a3a177c5154"]',
        },
        {
          community_name: "simpsons",
          handlers: '["388b2ff2-fa0b-4bd9-b90b-73df0abe2300"]',
        },
        {
          community_name: "coding",
          handlers: '["8b47fdd3-c9f2-43b2-88bd-52572db3e2d8"]',
        },
        {
          community_name: "programing",
          handlers: '["388b2ff2-fa0b-4bd9-b90b-73df0abe2300"]',
        },
        {
          community_name: "machine",
          handlers: '["8b47fdd3-c9f2-43b2-88bd-52572db3e2d8"]',
        },
        {
          community_name: "amazon",
          handlers: '["f2ea4ed3-890c-4bd5-a74c-5a3a177c5154"]',
        },
        {
          community_name: "flipkart",
          handlers: '["dab4643c-8d05-4fa5-91a6-74c637413f3b"]',
        },
        {
          community_name: "system architecture",
          handlers: '["9eb3a588-e263-42f9-a337-6704ade1085e"]',
        },
        {
          community_name: "stocks",
          handlers: '["f2ea4ed3-890c-4bd5-a74c-5a3a177c5154"]',
        },
        {
          community_name: "cristiano",
          handlers: '["dab4643c-8d05-4fa5-91a6-74c637413f3b"]',
        },
        {
          community_name: "eminem",
          handlers: '["9eb3a588-e263-42f9-a337-6704ade1085e"]',
        },
      ]);
    });
}
