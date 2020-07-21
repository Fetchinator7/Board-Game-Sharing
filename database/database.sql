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
	"game_id" serial NOT NULL,
	"owner_id" serial NOT NULL,
	"friend_id" integer DEFAULT NULL,
	"loan_start" DATE NOT NULL,
	"loan_end" DATE NOT NULL,
	"agreed" BOOLEAN NOT NULL DEFAULT 'false',
    "viewed" BOOLEAN NOT NULL DEFAULT 'false',
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
	"loaned_game_id" integer DEFAULT NULL,
	"friend_request_id" integer DEFAULT NULL,
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
	"message" varchar(1000) DEFAULT NULL,
	CONSTRAINT "friend_request_pk" PRIMARY KEY ("request_id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE "user_owned_game" ADD CONSTRAINT "user_owned_game_fk0" FOREIGN KEY ("game_id") REFERENCES "game"("game_id");
ALTER TABLE "user_owned_game" ADD CONSTRAINT "user_owned_game_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");

ALTER TABLE "friend" ADD CONSTRAINT "friend_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "friend" ADD CONSTRAINT "friend_fk1" FOREIGN KEY ("friend_id") REFERENCES "users"("user_id");

ALTER TABLE "loaned_game" ADD CONSTRAINT "No duplicate loans" UNIQUE("game_id", "owner_id", "friend_id", "loan_start", "loan_end");
ALTER TABLE "loaned_game" ADD CONSTRAINT "No duplicate block out days" UNIQUE("game_id", "owner_id", "loan_start", "loan_end");
ALTER TABLE "loaned_game" ADD CONSTRAINT "loaned_game_fk0" FOREIGN KEY ("game_id") REFERENCES "game"("game_id");
ALTER TABLE "loaned_game" ADD CONSTRAINT "loaned_game_fk2" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id");
ALTER TABLE "loaned_game" ADD CONSTRAINT "loaned_game_fk3" FOREIGN KEY ("friend_id") REFERENCES "users"("user_id");

ALTER TABLE "alert" ADD CONSTRAINT "alert_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "alert" ADD CONSTRAINT "alert_fk1" FOREIGN KEY ("loaned_game_id") REFERENCES "loaned_game"("loan_id");
ALTER TABLE "alert" ADD CONSTRAINT "alert_fk2" FOREIGN KEY ("friend_request_id") REFERENCES "friend_request"("request_id");

ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_fk0" FOREIGN KEY ("from_user_id") REFERENCES "users"("user_id");
ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_fk1" FOREIGN KEY ("to_user_id") REFERENCES "users"("user_id");

ALTER TABLE "user_owned_game" ADD CONSTRAINT "owned_game_id" UNIQUE("game_id", "user_id");
ALTER TABLE "friend_request" ADD CONSTRAINT "No duplicate friend requests" UNIQUE("from_user_id", "to_user_id");
ALTER TABLE "friend" ADD CONSTRAINT "No duplicate friends" UNIQUE("user_id", "friend_id");
