import { Client } from "@notionhq/client";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type AnyBlock = UnwrapPromise<
	ReturnType<Client["blocks"]["children"]["list"]>
>["results"][number];

export type BlockTypes = Extract<AnyBlock, { type: string }>["type"];

export type BlockOfType<T extends BlockTypes> = Extract<AnyBlock, { type: T }>;

export type RichTextObject = BlockOfType<"paragraph">["paragraph"];
