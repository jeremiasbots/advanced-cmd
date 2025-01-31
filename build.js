import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { exec } from "node:child_process";

const tsConfig = readFileSync("./tsconfig.json", { encoding: "utf-8" });

build({
	entryPoints: ["./index.ts"],
	outdir: "./dist",
	tsconfigRaw: tsConfig,
	minify: true,
	bundle: true,
	platform: "node",
});

exec("npx tsc");
