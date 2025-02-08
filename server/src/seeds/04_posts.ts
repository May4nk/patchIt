import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("posts")
    .del()
    .then(function () {
      return knex("posts").insert([
        {
          title: "What are ten commandments?",
          type: "BLOG",
          owner: "8b47fdd3-c9f2-43b2-88bd-52572db3e2d8",
          community_id: "986eab9b-87aa-4020-8f1b-97615a370156",
        },
        {
          title: "lorem ipsum crimson",
          type: "BLOG",
          owner: "388b2ff2-fa0b-4bd9-b90b-73df0abe2300",
          community_id: "66b1397e-7a6e-4cdc-85f5-790a0b5cf90c",
        },
        {
          title: "What is 3rd commandments?",
          type: "BLOG",
          owner: "9eb3a588-e263-42f9-a337-6704ade1085e",
          community_id: "5159e489-e256-4895-ba7f-16a6c1a110b0",
          content:
            "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
        },
        {
          title: "What is 7th commandments?",
          type: "BLOG",
          owner: "388b2ff2-fa0b-4bd9-b90b-73df0abe2300",
          community_id: "986eab9b-87aa-4020-8f1b-97615a370156",
        },
        {
          title: "lorem ipsum crimson",
          type: "BLOG",
          owner: "9eb3a588-e263-42f9-a337-6704ade1085e",
          community_id: "66b1397e-7a6e-4cdc-85f5-790a0b5cf90c",
        },
        {
          title: "who is best?",
          type: "POLL",
          owner: "8b47fdd3-c9f2-43b2-88bd-52572db3e2d8",
          community_id: "986eab9b-87aa-4020-8f1b-97615a370156",
          content: JSON.stringify([
            { value: "morty", count: 0 },
            { value: "rick", count: 0 },
          ]),
        },
        {
          title: "link",
          type: "LINK",
          owner: "388b2ff2-fa0b-4bd9-b90b-73df0abe2300",
          community_id: "5159e489-e256-4895-ba7f-16a6c1a110b0",
          content: "www.google.com",
        },
        {
          title: "Simpsons",
          type: "BLOG",
          owner: "8b47fdd3-c9f2-43b2-88bd-52572db3e2d8",
          community_id: "66b1397e-7a6e-4cdc-85f5-790a0b5cf90c",
          content:
            "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
        },
      ]);
    });
}
