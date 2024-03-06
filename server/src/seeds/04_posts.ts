import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("posts").del()
    .then(function() {
      return knex("posts").insert([
        { title: "rick & morty", type: "IMAGE", owner: 5, community_id: 1, content: "[{'id':1,'postCaption':'wabba labba dub dub','postLink':'','postSrc':'unnamed.jpg'},{'id':2,'postCaption':'some adventure pics','postLink':'','postSrc':'a.jpg'}]" },
        { title: "What are ten commandments?", type: "BLOG", owner: 2, community_id: 3 },

      ])    
    });
  
};
