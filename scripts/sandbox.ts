import findPackages from "find-packages"
import { promises as fs } from "fs"

async function main() {
  const pkgs = await findPackages("packages")
  await Promise.all(
    pkgs.map(async (pkg) => {
      let data = {
        ...pkg.manifest,
        devDependencies: {
          ...pkg.manifest.devDependencies,
          "clean-package": "2.1.1",
        },
      }

      const config = {
        replace: {
          main: "dist/index.cjs.js",
          module: "dist/index.esm.js",
          types: "dist/index.d.ts",
          exports: {
            ".": {
              import: "./dist/index.esm.js",
              require: "./dist/index.cjs.js",
            },
            "./package.json": "./package.json",
          },
        },
      }

      fs.writeFile(
        `${pkg.dir}/clean-package.config.json`,
        JSON.stringify(config, null, 2),
      )
      fs.writeFile(`${pkg.dir}/package.json`, JSON.stringify(data, null, 2))
    }),
  )
}

main()
