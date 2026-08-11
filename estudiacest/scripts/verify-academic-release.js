const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(__dirname, "academic-release-manifest.json");
const mode = process.argv.includes("--deploy")
  ? "deploy"
  : process.argv.includes("--predeploy")
    ? "predeploy"
    : "artifact";

function readManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    ...options
  });
}

function sha256(filePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

function normalizeReference(sourcePath, rawValue) {
  const value = rawValue.trim();
  if (
    !value ||
    value.startsWith("#") ||
    /^(?:https?:|mailto:|tel:|javascript:|data:|blob:)/i.test(value) ||
    value.includes("{{") ||
    value.includes("${")
  ) {
    return null;
  }

  const clean = value.split("#")[0].split("?")[0];
  if (!clean || clean === "/") {
    return null;
  }

  const relative = clean.startsWith("/")
    ? clean.slice(1)
    : path.posix.join(path.posix.dirname(sourcePath.replaceAll("\\", "/")), clean);

  const normalized = path.posix.normalize(relative);
  if (normalized.startsWith("../") || normalized.startsWith("api/")) {
    return null;
  }

  return normalized;
}

function validateLinkedFiles(entry, failures) {
  if (!entry.path.endsWith(".html")) {
    return;
  }

  const htmlPath = path.join(ROOT, entry.path);
  const html = fs.readFileSync(htmlPath, "utf8");
  const attributePattern = /\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi;
  const fileLikePattern = /\.(?:html?|css|js|json|png|jpe?g|webp|svg|gif|mp4|webm|pdf|woff2?)$/i;
  let match;

  while ((match = attributePattern.exec(html)) !== null) {
    const reference = normalizeReference(entry.path, match[1]);
    if (!reference || !fileLikePattern.test(reference)) {
      continue;
    }

    const target = path.join(ROOT, ...reference.split("/"));
    if (!fs.existsSync(target)) {
      failures.push(`${entry.path} referencia un archivo ausente: ${reference}`);
    }
  }
}

function validateArtifact(manifest) {
  const failures = [];

  for (const entry of manifest.criticalFiles) {
    const filePath = path.join(ROOT, ...entry.path.split("/"));
    if (!fs.existsSync(filePath)) {
      failures.push(`Falta el recurso critico: ${entry.path}`);
      continue;
    }

    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      failures.push(`El recurso critico no es un archivo: ${entry.path}`);
      continue;
    }

    if (entry.minBytes && stat.size < entry.minBytes) {
      failures.push(
        `${entry.path} pesa ${stat.size} bytes; minimo esperado: ${entry.minBytes}`
      );
    }

    if (entry.contains) {
      const contents = fs.readFileSync(filePath, "utf8");
      if (!contents.includes(entry.contains)) {
        failures.push(`${entry.path} no contiene la marca: ${entry.contains}`);
      }
    }

    if (entry.sha256) {
      const actualHash = sha256(filePath);
      if (actualHash !== entry.sha256.toLowerCase()) {
        failures.push(
          `${entry.path} cambio de hash. Actual: ${actualHash}; esperado: ${entry.sha256}`
        );
      }
    }

    validateLinkedFiles(entry, failures);
  }

  return failures;
}

function validateCanonicalProject(manifest) {
  const failures = [];
  const packagePath = path.join(ROOT, "package.json");
  const projectPath = path.join(ROOT, ".vercel", "project.json");

  if (path.basename(ROOT).toLowerCase() !== "estudiacest") {
    failures.push(`Directorio incorrecto para deploy: ${ROOT}`);
  }

  if (!fs.existsSync(packagePath)) {
    failures.push("No existe package.json en la fuente canonica.");
  } else {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    if (packageJson.name !== manifest.project.name) {
      failures.push(`Proyecto incorrecto en package.json: ${packageJson.name}`);
    }
  }

  if (!fs.existsSync(projectPath)) {
    failures.push("Falta .vercel/project.json; no se puede confirmar el proyecto de destino.");
  } else {
    const project = JSON.parse(fs.readFileSync(projectPath, "utf8"));
    if (
      project.projectId !== manifest.project.id ||
      project.projectName !== manifest.project.name
    ) {
      failures.push(
        `Proyecto Vercel incorrecto: ${project.projectName || "sin nombre"} / ${project.projectId || "sin id"}`
      );
    }
  }

  return failures;
}

async function matchesProduction(relativePath, productionOrigin) {
  const localPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(localPath) || !fs.statSync(localPath).isFile()) {
    return false;
  }

  try {
    const response = await fetch(new URL(`/${relativePath.replaceAll("\\", "/")}`, productionOrigin), {
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
      headers: { "cache-control": "no-cache" }
    });
    if (!response.ok) {
      return false;
    }

    const remote = Buffer.from(await response.arrayBuffer());
    const local = fs.readFileSync(localPath);
    return local.equals(remote);
  } catch {
    return false;
  }
}

async function validateGitState(manifest) {
  const failures = [];

  for (const entry of manifest.criticalFiles) {
    const tracked = run("git", ["ls-files", "--error-unmatch", "--", entry.path]);
    if (tracked.status !== 0) {
      failures.push(`Recurso critico sin respaldo en Git: ${entry.path}`);
    }
  }

  const status = run("git", [
    "status",
    "--porcelain=v1",
    "--untracked-files=all",
    "--",
    ...manifest.protectedAreas
  ]);

  if (status.status !== 0) {
    failures.push(`No se pudo leer git status: ${status.stderr.trim()}`);
    return failures;
  }

  const dirtyAcademicFiles = status.stdout
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  const unpublishedFiles = [];
  for (const line of dirtyAcademicFiles) {
    const statusCode = line.slice(0, 2);
    const gitPath = line.slice(3).replace(/^"|"$/g, "");
    const repositoryPrefix = `${path.basename(ROOT)}/`;
    const relativePath = gitPath.startsWith(repositoryPrefix)
      ? gitPath.slice(repositoryPrefix.length)
      : gitPath;
    const comparable =
      !statusCode.includes("D") &&
      !relativePath.includes(" -> ") &&
      (await matchesProduction(relativePath, manifest.project.productionOrigin));

    if (!comparable) {
      unpublishedFiles.push(line);
    }
  }

  if (unpublishedFiles.length > 0) {
    failures.push(
      "Hay cambios academicos distintos de produccion sin commit. El deploy queda bloqueado:\n" +
        unpublishedFiles.map((line) => `  ${line}`).join("\n")
    );
  }

  return failures;
}

async function validateProduction(manifest) {
  const failures = [];

  const gitRootResult = run("git", ["rev-parse", "--show-toplevel"]);
  const gitRoot = gitRootResult.status === 0 ? gitRootResult.stdout.trim() : "";
  const projectPrefix = gitRoot
    ? path.relative(gitRoot, ROOT).replaceAll("\\", "/")
    : path.basename(ROOT);

  function isNewTrackedResource(relativePath) {
    const gitPath = path.posix.join(projectPrefix, relativePath.replaceAll("\\", "/"));
    const inHead = run("git", ["cat-file", "-e", `HEAD:${gitPath}`]).status === 0;
    const inOrigin = run("git", ["cat-file", "-e", `origin/main:${gitPath}`]).status === 0;
    return inHead && !inOrigin;
  }

  for (const entry of manifest.criticalFiles) {
    const url = new URL(entry.url, manifest.project.productionOrigin);
    try {
      const response = await fetch(url, {
        method: entry.path.endsWith(".html") ? "GET" : "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
        headers: {
          "cache-control": "no-cache"
        }
      });

      const firstDeployResource = response.status === 404 && isNewTrackedResource(entry.path);
      if (!response.ok && !firstDeployResource && !(entry.allowMissingInProduction && response.status === 404)) {
        failures.push(`Produccion no responde para ${entry.url}: HTTP ${response.status}`);
      }
    } catch (error) {
      failures.push(`No se pudo verificar produccion ${entry.url}: ${error.message}`);
    }
  }

  return failures;
}

function printFailures(failures) {
  console.error("\nDEPLOY ACADEMICO BLOQUEADO\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  console.error(
    "\nNo uses vercel deploy directamente. Corrige el inventario y ejecuta npm run deploy:prod:safe.\n"
  );
}

async function verify(selectedMode) {
  const manifest = readManifest();
  const failures = validateArtifact(manifest);

  if (selectedMode !== "artifact") {
    failures.push(...validateCanonicalProject(manifest));
    failures.push(...(await validateGitState(manifest)));
    failures.push(...(await validateProduction(manifest)));
  }

  if (failures.length > 0) {
    printFailures(failures);
    return false;
  }

  console.log(
    selectedMode === "artifact"
      ? `Release academico verificado: ${manifest.criticalFiles.length} recursos criticos presentes.`
      : `Predeploy verificado: fuente canonica, Git y ${manifest.criticalFiles.length} recursos criticos correctos.`
  );
  return true;
}

async function main() {
  const selectedMode = mode === "deploy" ? "predeploy" : mode;
  const valid = await verify(selectedMode);
  if (!valid) {
    process.exitCode = 1;
    return;
  }

  if (mode !== "deploy") {
    return;
  }

  const npxCommand = process.platform === "win32" ? "cmd.exe" : "npx";
  const npxArgs =
    process.platform === "win32"
      ? ["/d", "/s", "/c", "npx vercel deploy --prod --yes --scope fconuvas-projects"]
      : ["vercel", "deploy", "--prod", "--yes", "--scope", "fconuvas-projects"];
  const deployment = spawnSync(
    npxCommand,
    npxArgs,
    {
      cwd: ROOT,
      stdio: "inherit"
    }
  );

  process.exitCode = deployment.status ?? 1;
}

main().catch((error) => {
  console.error(`Fallo inesperado del guard de deploy: ${error.stack || error.message}`);
  process.exitCode = 1;
});
