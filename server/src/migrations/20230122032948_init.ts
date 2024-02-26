import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

  await knex.schema.hasTable("roles").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("roles", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.string("role").unique().notNullable();
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
      });
    }
  });
  
  await knex.schema.hasTable("categories").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("categories", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable();
        table.string("categoryname").unique().notNullable().primary();
        table.string("categoryicon").defaultTo(null);
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable("users").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("users", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.string("email").notNullable().unique();
        table.string("username").notNullable().unique();
        table.string("password").notNullable();
        table.enu("status", ["ACTIVE","INACTIVE"]).defaultTo("ACTIVE").notNullable();
        table.enu("privacy", ["PUBLIC","PRIVATE"]).defaultTo("PUBLIC").notNullable();
        table.date("dob");
        table.string("country");
        table.string("about");
        table.boolean("new_user").defaultTo(true);
        table.string("background_pic");
        table.string("profile_pic").defaultTo(false);
        table.boolean("verified");
        table.integer("role").references("id").inTable("roles").defaultTo(9005).onDelete("CASCADE");
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at");
      });
    }
  });

  await knex.schema.hasTable("tags").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("tags", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.string("name").notNullable().unique();
        table.string("description");
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at");
      });
    }
  });

  await knex.schema.hasTable("communities").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("communities", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.string("communityname").notNullable().unique();
        table.integer("owner").references("id").inTable("users").onDelete("CASCADE");
        table.string("description");
        table.string("about");
        table.string("background_pic");
        table.string("category").references("categoryname").inTable("categories").onDelete("CASCADE");
        table.string("profile_pic");
        table.string("theme");
        table.enu("status", ["ACTIVE", "INACTIVE"]).defaultTo("ACTIVE").notNullable();
        table.enu("privacy", ["PUBLIC", "PRIVATE", "RESTRICTED"]).defaultTo("PUBLIC").notNullable();
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at");
      });
    }
  });

  await knex.schema.hasTable("posts").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("posts", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.string("title").notNullable();
        table.string("content");
        table.integer("likes").notNullable().defaultTo(0);
        table.integer("owner").references("id").inTable("users").onDelete("NO ACTION");
        table.integer("community_id").references("id").inTable("communities").onDelete("CASCADE");
        table.enu("type", ["BLOG", "IMAGE", "LINK", "POLL"]).defaultTo("BLOG").notNullable();
        table.enu("status", ["ACTIVE", "INACTIVE"]).defaultTo("ACTIVE").notNullable();
        table.enu("privacy", ["PUBLIC", "PRIVATE"]).defaultTo("PUBLIC").notNullable();
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
        table.date("updated_at");
      });
    }
  });

  await knex.schema.hasTable("user_community_relation").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("user_community_relation", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.integer("community_id").references("id").inTable("communities").onDelete("CASCADE");
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable("posts_tags_relation").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("posts_tags_relation", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.integer("post_id").references("id").inTable("posts").onDelete("CASCADE");
        table.integer("tag_id").references("id").inTable("tags").onDelete("CASCADE");
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable("chatrooms").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("chatrooms", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable();
        table.string("room_code").notNullable().primary();
        table.enu("status", ["ACTIVE","INACTIVE"]).defaultTo("ACTIVE").notNullable();
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable("chat").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("chat", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.string("room_id").references("room_code").inTable("chatrooms").onDelete("CASCADE");
        table.string("message").notNullable();
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable("user_chatrooms").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("user_chatrooms", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.string("room_id").references("room_code").inTable("chatrooms").onDelete("CASCADE");
        table.enu("status", ["ACTIVE","INACTIVE"]).defaultTo("ACTIVE").notNullable();
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable("comments").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("comments", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.integer("post_id").references("id").inTable("posts").onDelete("CASCADE");
        table.integer("parent_id").references("id").inTable("comments").onDelete("CASCADE");
        table.string("comment").notNullable();
        table.enu("status", ["DELETED","ACTIVE"]).defaultTo("ACTIVE").notNullable();
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable("post_like_dislikes").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("post_like_dislikes", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.integer("post_id").references("id").inTable("posts").onDelete("CASCADE");
        table.integer("reaction").defaultTo(1).notNullable();
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable("saved").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("saved", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.integer("post_id").references("id").inTable("posts").onDelete("CASCADE");
        table.boolean("pinned").defaultTo(false);
        table.boolean("saved").defaultTo(false);
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable("tokens").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("tokens", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.integer("user_id").references("id").inTable("users").onDelete("CASCADE").unique();
        table.string("token").notNullable();
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
      });
    }
  });
  
  await knex.schema.hasTable("user_preferences").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("user_preferences", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.integer("user_id").references("id").inTable("users").onDelete("CASCADE").notNullable().unique();
        table.boolean("nsfw").defaultTo(false);
        table.boolean("visiblity").defaultTo(true);
        table.boolean("allowppltofollow").defaultTo(true);
        table.boolean("show_nsfw").defaultTo(false);
        table.boolean("contentvisiblity").defaultTo(false);
        table.boolean("chatreq").defaultTo(true);
        table.boolean("mentionusername").defaultTo(true);
        table.boolean("activityonpost").defaultTo(true);
        table.boolean("activityoncmnt").defaultTo(true);
        table.boolean("activityonpostfollowed").defaultTo(true);
        table.boolean("patcoinreceived").defaultTo(true);
        table.boolean("communityfollowed").defaultTo(true);
        table.boolean("birthday").defaultTo(true);
        table.boolean("announcements").defaultTo(true);
        table.boolean("searchshowprofile").defaultTo(true);
        table.boolean("auth_twofactor").defaultTo(true);
        table.enu("sendmsg", ["ANYONE", "NONE", "FOLLOWERS"]).defaultTo("ANYONE").notNullable();
      });    
    }
  });
  await knex.schema.hasTable("community_preferences").then(function(exists: boolean) {
    if(!exists) {
      return knex.schema.createTable("community_preferences", function(table: Knex.TableBuilder) {
        table.increments("id").unique().notNullable().primary();
        table.string("community_name").references("communityname").inTable("communities").onDelete("CASCADE").notNullable().unique();
        table.boolean("nsfw").defaultTo(false);
        table.boolean("allowppltofollow").defaultTo(true);
        table.boolean("newuserreq").defaultTo(true);
        table.boolean("reportonpost").defaultTo(true);
        table.boolean("reportoncmnt").defaultTo(true);
        table.boolean("reportonuser").defaultTo(true);
        table.boolean("activityincommunity").defaultTo(true);
        table.boolean("birthday").defaultTo(true);
      });    
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
  await knex.schema.dropTable("tags");
  await knex.schema.dropTable("posts");
  await knex.schema.dropTable("roles");
  await knex.schema.dropTable("saved");
  await knex.schema.dropTable("tokens");
  await knex.schema.dropTable("chatrooms");
  await knex.schema.dropTable("chat");
  await knex.schema.dropTable("user_chatrooms");
  await knex.schema.dropTable("post_like_dislikes");
  await knex.schema.dropTable("comments");
  await knex.schema.dropTable("communities");
  await knex.schema.dropTable("posts_tags_relation");
  await knex.schema.dropTable("user_community_relation");
  await knex.schema.dropTable("user_preferences");
  await knex.schema.dropTable("community_preferences");
}

