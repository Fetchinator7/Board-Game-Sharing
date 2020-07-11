--Visibility sets if a user;s profile is public or private.
--1 = Public, 2 = Only Those With The Profile Link, 3 = Friends Only, 4 = Private.

--1 = Public, 2 = Only Those With The Profile Link, 3 = Friends Only, 4 = Private.
CREATE TABLE "users" (
	"user_id" serial NOT NULL,
	"user_name" varchar(50) NOT NULL UNIQUE,
	"email" varchar(254) NOT NULL UNIQUE,
	"password" varchar(128) NOT NULL,
	"visibility" smallint,
	CONSTRAINT "user_pk" PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "game" (
	"game_id" serial NOT NULL,
	"bgg_game_id" varchar(255) UNIQUE,
	"game_img" varchar(255),
	"title" varchar(255) NOT NULL,
	"player_range" varchar(50),
	"playtime" varchar(50),
	CONSTRAINT "game_pk" PRIMARY KEY ("game_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "user_owned_game" (
	"owned_game_id" serial NOT NULL,
	"game_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"comments" varchar(5000),
	CONSTRAINT "user_owned_game_pk" PRIMARY KEY ("owned_game_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "friend" (
	"friends_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"friend_id" serial NOT NULL,
	CONSTRAINT "friend_pk" PRIMARY KEY ("friends_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "loaned_game" (
	"loan_id" serial NOT NULL,
	"game_id" serial,
	"game_owner_notes" TEXT,
	"owner_id" serial NOT NULL,
	"friend_id" serial NOT NULL,
	"loan_start" DATE NOT NULL,
	"loan_end" DATE,
	"agreed" BOOLEAN NOT NULL DEFAULT 'false',
	CONSTRAINT "loaned_game_pk" PRIMARY KEY ("loan_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "alert" (
	"alert_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"viewed_at" TIMESTAMP,
	"alert_text" varchar(2000) NOT NULL,
	"loaned_game_id" serial,
	"friend_request_id" serial,
	CONSTRAINT "alert_pk" PRIMARY KEY ("alert_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "friend_request" (
	"request_id" serial NOT NULL,
	"from_user_id" serial NOT NULL,
	"to_user_id" serial NOT NULL,
	"answered" BOOLEAN NOT NULL DEFAULT 'false',
	"accepted" BOOLEAN NOT NULL DEFAULT 'false',
	CONSTRAINT "friend_request_pk" PRIMARY KEY ("request_id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE "user_owned_game" ADD CONSTRAINT "user_owned_game_fk0" FOREIGN KEY ("game_id") REFERENCES "game"("game_id");
ALTER TABLE "user_owned_game" ADD CONSTRAINT "user_owned_game_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");

ALTER TABLE "friend" ADD CONSTRAINT "friend_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "friend" ADD CONSTRAINT "friend_fk1" FOREIGN KEY ("friend_id") REFERENCES "users"("user_id");

ALTER TABLE "loaned_game" ADD CONSTRAINT "loaned_game_fk0" FOREIGN KEY ("game_id") REFERENCES "game"("game_id");

-- ALTER TABLE "loaned_game" ADD CONSTRAINT "loaned_game_fk1" FOREIGN KEY ("game_owner_notes") REFERENCES "user_owned_game"("comments");

ALTER TABLE "loaned_game" ADD CONSTRAINT "loaned_game_fk2" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id");
ALTER TABLE "loaned_game" ADD CONSTRAINT "loaned_game_fk3" FOREIGN KEY ("friend_id") REFERENCES "users"("user_id");

ALTER TABLE "alert" ADD CONSTRAINT "alert_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "alert" ADD CONSTRAINT "alert_fk1" FOREIGN KEY ("loaned_game_id") REFERENCES "loaned_game"("loan_id");
ALTER TABLE "alert" ADD CONSTRAINT "alert_fk2" FOREIGN KEY ("friend_request_id") REFERENCES "friend_request"("request_id");

ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_fk0" FOREIGN KEY ("from_user_id") REFERENCES "users"("user_id");
ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_fk1" FOREIGN KEY ("to_user_id") REFERENCES "users"("user_id");

ALTER TABLE "user_owned_game" ADD CONSTRAINT "owned_game_id" UNIQUE("game_id", "user_id")



INSERT INTO "users" ("user_name", "email", "password", "visibility")
VALUES ('Username 1', 'email@email', 'Password', '1'),
('Username 2', 'email2@email', 'Password', '2'),
('Username 3', 'email3@email', 'Password', '3'),
('Test1', 'Test1', '$2a$10$dXYFVtknulisLFckVNpOqOonE0mzk8yP2crCJW3wUr5VLhhYgU0Py', '3');

INSERT INTO "game" ("bgg_game_id", "game_img", "title", "player_range", "playtime")
VALUES ('7', 'img/path/7', 'Title7', '1-7', '70');

INSERT INTO "user_owned_game" ("game_id", "user_id", "comments")
VALUES ('4', '11', 'This is a cool comment for catan');

SELECT ("user_owned_game"."game_id", "user_owned_game".comments)
FROM "user_owned_game" JOIN "game" ON "game".bgg_game_id = "user_owned_game".game_id
WHERE "user_owned_game".user_id = '2'
GROUP BY "user_owned_game"."game_id", "comments";

SELECT *
FROM "user_owned_game" JOIN "game" ON "game".bgg_game_id = "user_owned_game".game_id
WHERE "user_owned_game".user_id = '2';

SELECT "user_owned_game"."game_id", "user_owned_game".comments
FROM "user_owned_game" WHERE "user_owned_game".user_id = 11;

SELECT * FROM "game"
INNER JOIN "user_owned_game" ON "game".game_id="user_owned_game".game_id
WHERE "user_owned_game".user_id = 11;

SELECT "user_owned_game".user_id, "user_owned_game".game_id, "bgg_game_id", 
"game_img", "title", "player_range", "playtime",
"user_owned_game".comments FROM "game"
INNER JOIN "user_owned_game" ON "game".game_id="user_owned_game".game_id
WHERE "user_owned_game".user_id = 11;

SELECT "bgg_game_id" FROM "game";
SELECT "game_id" FROM "game" WHERE "bgg_game_id" = '13';

SELECT * FROM "user_owned_game" WHERE "user_owned_game".game_id = '3' AND "user_owned_game".user_id = 11;
DELETE FROM "user_owned_game" WHERE "user_owned_game".game_id = '2';

SELECT * FROM "game" WHERE "game".bgg_game_id = '5';

INSERT INTO "user_owned_game" ("game_id", "user_id") VALUES ('Username 1', 'email@email', 'Password', '1');

INSERT INTO "game" ("bgg_game_id", "game_img", "title", "player_range", "playtime") VALUES ('7', 'img/path/7', 'Title7', '1-7', '70');

--Select all games from the games table and put those in the global state.


INSERT INTO "friend" ("user_id", "friend_id")
VALUES ('11', '10');

SELECT ("friend_id") FROM "friend" WHERE "user_id" = '11';
SELECT "friend".friend_id, "users".user_name 
FROM "friend"
JOIN "users" ON "friend".friend_id="users".user_id
WHERE "friend".user_id = 11;
