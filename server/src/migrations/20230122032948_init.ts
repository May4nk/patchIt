import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

  await knex.schema.hasTable("roles").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "roles",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table.text("role").unique().notNullable();
          table.integer("role_id").unique().notNullable();
          table.text("access").defaultTo(null);
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        }
      );
    }
  });

  await knex.schema.hasTable("categories").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "categories",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table.text("categoryname").unique().notNullable().primary();
          table.text("categoryicon").defaultTo(null);
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        }
      );
    }
  });

  await knex.schema.hasTable("users").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "users",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table.text("email").unique().notNullable();
          table.text("username").unique().notNullable();
          table.text("password").notNullable();
          table
            .enu("status", ["ACTIVE", "INACTIVE"])
            .defaultTo("ACTIVE")
            .notNullable();
          table
            .enu("privacy", ["PUBLIC", "PRIVATE"])
            .defaultTo("PUBLIC")
            .notNullable();
          table
            .integer("role")
            .references("role_id")
            .inTable("roles")
            .defaultTo(9005)
            .onDelete("CASCADE");
          table.date("dob");
          table.text("country");
          table.text("about");
          table.boolean("new_user").defaultTo(true);
          table.text("background_pic").defaultTo(null);
          table.text("profile_pic").defaultTo(null);
          table.boolean("verified").defaultTo(false);
          table.text("social_links").defaultTo(null);
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
          table.timestamp("updated_at");
        }
      );
    }
  });

  await knex.schema.hasTable("tags").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "tags",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table.text("name").notNullable().unique();
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        }
      );
    }
  });

  await knex.schema.hasTable("communities").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "communities",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table.text("name").notNullable().unique();
          table.text("display_name");
          table
            .uuid("owner")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
          table.text("description");
          table.text("about");
          table.text("background_pic").defaultTo(null);
          table
            .text("category")
            .references("categoryname")
            .inTable("categories")
            .onDelete("CASCADE");
          table.text("profile_pic").defaultTo(null);
          table.text("social_links").defaultTo(null);
          table.text("theme");
          table
            .enu("status", ["ACTIVE", "INACTIVE"])
            .defaultTo("ACTIVE")
            .notNullable();
          table
            .enu("privacy", ["PUBLIC", "PRIVATE", "RESTRICTED"])
            .defaultTo("PUBLIC")
            .notNullable();
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
          table.timestamp("updated_at");
        }
      );
    }
  });

  await knex.schema
    .hasTable("tag_community_relation")
    .then(function (exists: boolean) {
      if (!exists) {
        return knex.schema.createTable(
          "tag_community_relation",
          function (table: Knex.TableBuilder) {
            table
              .uuid("id")
              .primary()
              .unique()
              .notNullable()
              .defaultTo(knex.raw("gen_random_uuid()"));
            table
              .uuid("tag_id")
              .references("id")
              .inTable("tags")
              .onDelete("CASCADE");
            table
              .uuid("community_id")
              .references("id")
              .inTable("communities")
              .onDelete("CASCADE");
            table
              .timestamp("created_at")
              .notNullable()
              .defaultTo(knex.fn.now());
          }
        );
      }
    });

  await knex.schema.hasTable("posts").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "posts",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table.text("title").notNullable();
          table.text("content");
          table.integer("likes").notNullable().defaultTo(0);
          table
            .uuid("owner")
            .references("id")
            .inTable("users")
            .onDelete("NO ACTION");
          table
            .uuid("community_id")
            .references("id")
            .inTable("communities")
            .onDelete("NO ACTION")
            .defaultTo(null);
          table
            .enu("type", ["BLOG", "IMAGE", "LINK", "POLL"])
            .defaultTo("BLOG")
            .notNullable();
          table
            .enu("status", ["ACTIVE", "DELETED"])
            .defaultTo("ACTIVE")
            .notNullable();
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
          table.timestamp("updated_at");
        }
      );
    }
  });

  await knex.schema
    .hasTable("user_community_relation")
    .then(function (exists: boolean) {
      if (!exists) {
        return knex.schema.createTable(
          "user_community_relation",
          function (table: Knex.TableBuilder) {
            table
              .uuid("id")
              .primary()
              .unique()
              .notNullable()
              .defaultTo(knex.raw("gen_random_uuid()"));
            table
              .uuid("user_id")
              .references("id")
              .inTable("users")
              .onDelete("CASCADE");
            table
              .uuid("community_id")
              .references("id")
              .inTable("communities")
              .onDelete("CASCADE");
            table
              .timestamp("created_at")
              .notNullable()
              .defaultTo(knex.fn.now());
          }
        );
      }
    });

  await knex.schema
    .hasTable("posts_tags_relation")
    .then(function (exists: boolean) {
      if (!exists) {
        return knex.schema.createTable(
          "posts_tags_relation",
          function (table: Knex.TableBuilder) {
            table
              .uuid("id")
              .primary()
              .unique()
              .notNullable()
              .defaultTo(knex.raw("gen_random_uuid()"));
            table
              .uuid("post_id")
              .references("id")
              .inTable("posts")
              .onDelete("CASCADE");
            table
              .uuid("tag_id")
              .references("id")
              .inTable("tags")
              .onDelete("CASCADE");
            table
              .timestamp("created_at")
              .notNullable()
              .defaultTo(knex.fn.now());
          }
        );
      }
    });

  await knex.schema
    .hasTable("user_user_relation")
    .then(function (exists: boolean) {
      if (!exists) {
        return knex.schema.createTable(
          "user_user_relation",
          function (table: Knex.TableBuilder) {
            table
              .uuid("id")
              .primary()
              .unique()
              .notNullable()
              .defaultTo(knex.raw("gen_random_uuid()"));
            table
              .uuid("follower")
              .references("id")
              .inTable("users")
              .onDelete("CASCADE");
            table
              .uuid("following")
              .references("id")
              .inTable("users")
              .onDelete("CASCADE");
            table
              .timestamp("created_at")
              .notNullable()
              .defaultTo(knex.fn.now());
          }
        );
      }
    });

  await knex.schema.hasTable("notifications").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "notifications",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table.enu("type", ["CHAT", "FRIEND"]).defaultTo("FRIEND");
          table.text("message").notNullable();
          table
            .uuid("touser")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
          table
            .uuid("fromuser")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
          table
            .enu("status", ["ACCEPT", "REJECT", "PENDING"])
            .notNullable()
            .defaultTo("PENDING");
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        }
      );
    }
  });

  await knex.schema.hasTable("chatrooms").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "chatrooms",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table.text("roomName").defaultTo(null);
          table
            .uuid("owner")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
          table
            .enu("status", ["ACTIVE", "INACTIVE"])
            .defaultTo("ACTIVE")
            .notNullable();
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        }
      );
    }
  });

  await knex.schema.hasTable("messages").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "messages",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table
            .uuid("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
          table
            .uuid("room_id")
            .references("id")
            .inTable("chatrooms")
            .onDelete("CASCADE");
          table.boolean("media").notNullable().defaultTo(false);
          table.text("text").notNullable();
          table
            .enu("status", ["DELETED", "ACTIVE"])
            .defaultTo("ACTIVE")
            .notNullable();
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        }
      );
    }
  });

  await knex.schema.hasTable("user_chatrooms").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "user_chatrooms",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table
            .uuid("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
          table
            .uuid("room_id")
            .references("id")
            .inTable("chatrooms")
            .onDelete("CASCADE");
          table
            .enu("status", ["ACTIVE", "INACTIVE"])
            .defaultTo("ACTIVE")
            .notNullable();
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        }
      );
    }
  });

  await knex.schema.hasTable("comments").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "comments",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table.integer("likes").notNullable().defaultTo(0);
          table
            .uuid("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
          table
            .uuid("post_id")
            .references("id")
            .inTable("posts")
            .onDelete("CASCADE");
          table
            .uuid("parent_id")
            .references("id")
            .inTable("comments")
            .onDelete("CASCADE");
          table.text("text").notNullable();
          table
            .enu("status", ["DELETED", "ACTIVE"])
            .defaultTo("ACTIVE")
            .notNullable();
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        }
      );
    }
  });

  await knex.schema
    .hasTable("user_comment_relation")
    .then(function (exists: boolean) {
      if (!exists) {
        return knex.schema.createTable(
          "user_comment_relation",
          function (table: Knex.TableBuilder) {
            table
              .uuid("id")
              .primary()
              .unique()
              .notNullable()
              .defaultTo(knex.raw("gen_random_uuid()"));
            table
              .uuid("user_id")
              .references("id")
              .inTable("users")
              .onDelete("CASCADE");
            table
              .uuid("comment_id")
              .references("id")
              .inTable("comments")
              .onDelete("CASCADE");
            table
              .timestamp("created_at")
              .notNullable()
              .defaultTo(knex.fn.now());
          }
        );
      }
    });

  await knex.schema
    .hasTable("post_like_dislikes")
    .then(function (exists: boolean) {
      if (!exists) {
        return knex.schema.createTable(
          "post_like_dislikes",
          function (table: Knex.TableBuilder) {
            table
              .uuid("id")
              .primary()
              .unique()
              .notNullable()
              .defaultTo(knex.raw("gen_random_uuid()"));
            table
              .uuid("user_id")
              .references("id")
              .inTable("users")
              .onDelete("CASCADE");
            table
              .uuid("post_id")
              .references("id")
              .inTable("posts")
              .onDelete("CASCADE");
            table
              .enu("reaction", ["TRUE", "FALSE", "NONE"])
              .defaultTo("NONE")
              .notNullable();
            table
              .timestamp("created_at")
              .notNullable()
              .defaultTo(knex.fn.now());
          }
        );
      }
    });

  await knex.schema.hasTable("saved").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "saved",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table
            .uuid("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
          table
            .uuid("post_id")
            .references("id")
            .inTable("posts")
            .onDelete("CASCADE");
          table.boolean("pinned").defaultTo(false);
          table.boolean("saved").defaultTo(false);
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        }
      );
    }
  });

  await knex.schema.hasTable("tokens").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "tokens",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table
            .uuid("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .unique();
          table.text("token").notNullable();
          table
            .enu("status", ["DELETED", "ACTIVE"])
            .defaultTo("ACTIVE")
            .notNullable();
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        }
      );
    }
  });

  await knex.schema.hasTable("magic_tokens").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "magic_tokens",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table
            .text("email")
            .references("email")
            .inTable("users")
            .onDelete("CASCADE")
            .unique();
          table.text("token").notNullable();
          table.timestamp("expires_at").notNullable();
          table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        }
      );
    }
  });

  await knex.schema
    .hasTable("user_preferences")
    .then(function (exists: boolean) {
      if (!exists) {
        return knex.schema.createTable(
          "user_preferences",
          function (table: Knex.TableBuilder) {
            table
              .uuid("id")
              .primary()
              .unique()
              .notNullable()
              .defaultTo(knex.raw("gen_random_uuid()"));
            table
              .text("user")
              .references("username")
              .inTable("users")
              .onDelete("CASCADE")
              .notNullable()
              .unique();
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
            table.text("blocked");
            table
              .enu("sendmsg", ["ANYONE", "NONE", "FOLLOWERS"])
              .defaultTo("ANYONE")
              .notNullable();
          }
        );
      }
    });

  await knex.schema
    .hasTable("community_preferences")
    .then(function (exists: boolean) {
      if (!exists) {
        return knex.schema.createTable(
          "community_preferences",
          function (table: Knex.TableBuilder) {
            table
              .uuid("id")
              .primary()
              .unique()
              .notNullable()
              .defaultTo(knex.raw("gen_random_uuid()"));
            table
              .text("community_name")
              .references("name")
              .inTable("communities")
              .onDelete("CASCADE")
              .notNullable()
              .unique();
            table.text("handlers");
            table.boolean("nsfw").defaultTo(false);
            table.boolean("newuserreq").defaultTo(true);
            table.boolean("reportonpost").defaultTo(true);
            table.boolean("reportoncmnt").defaultTo(true);
            table.boolean("reportonuser").defaultTo(true);
            table.boolean("activityincommunity").defaultTo(true);
            table.boolean("birthday").defaultTo(true);
          }
        );
      }
    });

  await knex.schema.hasTable("polls").then(function (exists: boolean) {
    if (!exists) {
      return knex.schema.createTable(
        "polls",
        function (table: Knex.TableBuilder) {
          table
            .uuid("id")
            .primary()
            .unique()
            .notNullable()
            .defaultTo(knex.raw("gen_random_uuid()"));
          table
            .uuid("post_id")
            .references("id")
            .inTable("posts")
            .onDelete("CASCADE")
            .notNullable();
          table
            .uuid("user_id")
            .references("id")
            .inTable("users")
            .onDelete("NO ACTION")
            .notNullable();
          table.text("pollvalue").notNullable();
        }
      );
    }
  });

  await knex.schema
    .hasTable("chat_preferences")
    .then(function (exists: boolean) {
      if (!exists) {
        return knex.schema.createTable(
          "chat_preferences",
          function (table: Knex.TableBuilder) {
            table
              .uuid("id")
              .primary()
              .unique()
              .notNullable()
              .defaultTo(knex.raw("gen_random_uuid()"));
            table
              .uuid("owner")
              .references("id")
              .inTable("users")
              .onDelete("CASCADE");
            table
              .uuid("room")
              .references("id")
              .inTable("chatrooms")
              .onDelete("CASCADE");
            table
              .text("admin")
              .references("username")
              .inTable("users")
              .onDelete("CASCADE")
              .defaultTo(null);
            table
              .text("co_admin")
              .references("username")
              .inTable("users")
              .onDelete("CASCADE")
              .defaultTo(null);
            table
              .text("acceptor")
              .references("username")
              .inTable("users")
              .onDelete("CASCADE")
              .defaultTo(null);
            table
              .text("operator")
              .references("username")
              .inTable("users")
              .onDelete("CASCADE")
              .defaultTo(null);
            table.text("blocked");
            table
              .enu("allowedmedia", ["ALL", "IMAGES", "VIDEOS"])
              .defaultTo("ALL")
              .notNullable();
            table.text("chatgrouptheme");
            table.text("group_profile");
            table.text("about");
          }
        );
      }
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("roles");
  await knex.schema.dropTable("categories");
  await knex.schema.dropTable("users");
  await knex.schema.dropTable("tags");
  await knex.schema.dropTable("communities");
  await knex.schema.dropTable("tag_community_relation");
  await knex.schema.dropTable("posts");
  await knex.schema.dropTable("user_community_relation");
  await knex.schema.dropTable("posts_tags_relation");
  await knex.schema.dropTable("chatrooms");
  await knex.schema.dropTable("chat");
  await knex.schema.dropTable("user_chatrooms");
  await knex.schema.dropTable("comments");
  await knex.schema.dropTable("user_comment_relation");
  await knex.schema.dropTable("post_like_dislikes");
  await knex.schema.dropTable("saved");
  await knex.schema.dropTable("magic_tokens");
  await knex.schema.dropTable("tokens");
  await knex.schema.dropTable("user_preferences");
  await knex.schema.dropTable("community_preferences");
  await knex.schema.dropTable("polls");
  await knex.schema.dropTable("chat_preferences");
  await knex.schema.dropTable("user_user_relation");
  await knex.schema.dropTable("notifications");
}
