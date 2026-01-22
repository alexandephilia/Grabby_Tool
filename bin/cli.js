#!/usr/bin/env node
const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgRed: "\x1b[31m",
  fgBlue: "\x1b[34m",
  fgCyan: "\x1b[36m",
  fgMagenta: "\x1b[35m",
  bgGreen: "\x1b[42m",
  bgBlue: "\x1b[44m",
};

const ICONS = {
  fire: "›",
  done: "✓",
  wait: "○",
  warn: "⚠",
  fail: "✗",
  info: "›",
  pkg: "◆",
  gear: "»",
};

function log(msg, color = COLORS.reset) {
  console.log(`${color}${msg}${COLORS.reset}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkCommand(cmd) {
  try {
    execSync(`command -v ${cmd} > /dev/null 2>&1`);
    return true;
  } catch (e) {
    return false;
  }
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const prompt = `\n${COLORS.fgYellow}${ICONS.info} ${COLORS.bright}${question}${COLORS.reset} ${COLORS.dim}(y/n)${COLORS.reset}: `;
    
    rl.question(prompt, (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();
      resolve(trimmed === "y" || trimmed === "yes" || trimmed === "");
    });
  });
}


/**
 * Visual progress bar with percentage
 */
function createProgressBar(label, total = 100) {
  const width = 30;
  let current = 0;

  const render = () => {
    const percent = Math.round((current / total) * 100);
    const filled = Math.round((current / total) * width);
    const empty = width - filled;
    const bar = `${COLORS.fgCyan}${"█".repeat(filled)}${COLORS.dim}${"░".repeat(empty)}${COLORS.reset}`;
    process.stdout.write(`\r${ICONS.pkg} ${label} ${bar} ${percent}%`);
  };

  const update = (value) => {
    current = Math.min(value, total);
    render();
  };

  const complete = () => {
    current = total;
    render();
    process.stdout.write(`\n`);
  };

  return { update, complete, render };
}

/**
 * Animated spinner with status text
 */
function createSpinner(text) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  let timer = null;

  const start = () => {
    timer = setInterval(() => {
      process.stdout.write(`\r${COLORS.fgCyan}${frames[i]}${COLORS.reset} ${text}...`);
      i = (i + 1) % frames.length;
    }, 80);
  };

  const stop = (symbol = ICONS.done, finalText = text, finalColor = COLORS.fgGreen) => {
    if (timer) clearInterval(timer);
    process.stdout.write(`\r${finalColor}${symbol}${COLORS.reset} ${finalText}                    \n`);
  };

  const warn = (message) => {
    if (timer) clearInterval(timer);
    process.stdout.write(`\r${COLORS.fgYellow}${ICONS.warn}${COLORS.reset} ${text}: ${COLORS.fgYellow}${message}${COLORS.reset}                    \n`);
  };

  const fail = (message) => {
    if (timer) clearInterval(timer);
    process.stdout.write(`\r${COLORS.fgRed}${ICONS.fail}${COLORS.reset} ${text}: ${COLORS.fgRed}${message}${COLORS.reset}                    \n`);
  };

  return { start, stop, warn, fail };
}

/**
 * Execute command with live progress bar (or simulate in demo mode)
 */
async function execWithProgress(cmd, label, simulate = false) {
  const bar = createProgressBar(label);
  bar.render();
  
  return new Promise((resolve) => {
    let progress = 0;
    
    if (simulate) {
      // Demo mode - just animate the bar
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 5;
        if (progress >= 100) {
          clearInterval(interval);
          bar.update(100);
          bar.complete();
          resolve(true);
        } else {
          bar.update(progress);
        }
      }, 150);
    } else {
      // Real mode - run command with child process
      const child = spawn('sh', ['-c', cmd], { stdio: 'pipe' });
      
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 90) progress = 90;
        bar.update(progress);
      }, 200);

      child.on('close', (code) => {
        clearInterval(interval);
        bar.update(100);
        bar.complete();
        resolve(code === 0);
      });

      child.on('error', () => {
        clearInterval(interval);
        bar.complete();
        resolve(false);
      });
    }
  });
}

async function init(demoMode = false) {
  const banner = `
${COLORS.fgCyan}
   ██████╗ ██████╗  █████╗ ██████╗ ██████╗ ██╗   ██╗
  ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
  ██║  ███╗██████╔╝███████║██████╔╝██████╔╝ ╚████╔╝ 
  ██║   ██║██╔══██╗██╔══██║██╔══██╗██╔══██╗  ╚██╔╝  
  ╚██████╔╝██║  ██║██║  ██║██████╔╝██████╔╝   ██║   
   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═════╝    ╚═╝   
${COLORS.reset}
  ${COLORS.bright}Interactive element inspector for AI frontend development${COLORS.reset}
  `;
  
  console.clear();
  console.log(banner);
  
  if (demoMode) {
    log(`${ICONS.gear} ${COLORS.fgMagenta}DEMO MODE${COLORS.reset} - Simulating missing dependencies\n`);
  }
  
  log(`${ICONS.fire} ${COLORS.bright}Infecting project with Grabby protocol...${COLORS.reset}\n`);

  // 1. Environment Check
  const envSpinner = createSpinner("Checking Environment");
  envSpinner.start();
  await sleep(500);
  
  const hasBrew = demoMode ? false : checkCommand("brew");
  if (!hasBrew) {
    envSpinner.warn("Homebrew missing (optional but recommended)");
    log(`   ${COLORS.dim}Install from: https://brew.sh/${COLORS.reset}`);
  } else {
    envSpinner.stop(ICONS.done, "Environment ready");
  }

  // 2. mgrep Check
  const mgrepSpinner = createSpinner("Checking mgrep");
  mgrepSpinner.start();
  await sleep(400);
  
  const hasMgrep = demoMode ? false : checkCommand("mgrep");
  if (!hasMgrep) {
    mgrepSpinner.warn("mgrep not installed");
    
    if (await ask("Install @mixedbread-ai/mgrep globally?")) {
      console.log("");
      const success = await execWithProgress("npm install -g @mixedbread-ai/mgrep", "Installing mgrep", demoMode);
      if (success) {
        log(`${ICONS.done} mgrep installed successfully`, COLORS.fgGreen);
      } else {
        log(`${ICONS.fail} mgrep installation failed`, COLORS.fgRed);
      }
    } else {
      log(`   ${COLORS.dim}Skipped. Install manually: npm install -g @mixedbread-ai/mgrep${COLORS.reset}`);
    }
  } else {
    mgrepSpinner.stop(ICONS.done, "mgrep ready");
  }

  // 3. comby Check
  const combySpinner = createSpinner("Checking comby");
  combySpinner.start();
  await sleep(400);
  
  const hasComby = demoMode ? false : checkCommand("comby");
  if (!hasComby) {
    combySpinner.warn("comby not installed");
    
    if (await ask("Install comby via Homebrew?")) {
      if (demoMode || checkCommand("brew")) {
        console.log("");
        const success = await execWithProgress("brew install comby", "Installing comby", demoMode);
        if (success) {
          log(`${ICONS.done} comby installed successfully`, COLORS.fgGreen);
        } else {
          log(`${ICONS.fail} comby installation failed`, COLORS.fgRed);
        }
      } else {
        log(`   ${COLORS.fgRed}Cannot install comby without Homebrew${COLORS.reset}`);
        log(`   ${COLORS.dim}Install manually: brew install comby${COLORS.reset}`);
      }
    } else {
      log(`   ${COLORS.dim}Skipped. Install manually: brew install comby${COLORS.reset}`);
    }
  } else {
    combySpinner.stop(ICONS.done, "comby ready");
  }

  console.log("");

  // 4. Skills Injection
  const skillsSpinner = createSpinner("Injecting Knowledge Base (Skills/)");
  const targetSkillsDir = path.join(process.cwd(), "Skills");
  const sourceSkillsDir = path.join(__dirname, "..", "Skills");

  skillsSpinner.start();
  await sleep(300);
  
  if (!fs.existsSync(targetSkillsDir)) {
    if (fs.existsSync(sourceSkillsDir)) {
      try {
        execSync(`cp -r "${sourceSkillsDir}" "${process.cwd()}"`, { stdio: 'pipe' });
        skillsSpinner.stop(ICONS.done, "Skills/ injected");
      } catch (e) {
        skillsSpinner.fail("Failed to copy Skills/");
      }
    } else {
      skillsSpinner.fail("Source Skills/ not found in package");
    }
  } else {
    skillsSpinner.stop(ICONS.info, "Skills/ already exists", COLORS.fgBlue);
  }

  // 5. Framework Adapter Setup
  const adapterSpinner = createSpinner("Configuring Framework Adapters");
  adapterSpinner.start();
  await sleep(300);
  
  const packageJsonPath = path.join(process.cwd(), "package.json");
  let isVite = fs.existsSync(path.join(process.cwd(), "vite.config.ts")) || fs.existsSync(path.join(process.cwd(), "vite.config.js"));
  let isNext = fs.existsSync(path.join(process.cwd(), "next.config.js")) || fs.existsSync(path.join(process.cwd(), "next.config.mjs"));

  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (allDeps["vite"]) isVite = true;
      if (allDeps["next"]) isNext = true;
    } catch (e) {}
  }

  if (isVite) {
    adapterSpinner.stop(ICONS.done, "Vite detected");
    log(`${ICONS.gear} Running Vite setup...`, COLORS.fgBlue);
    require("../scripts/setup-vite");
  } else if (isNext) {
    adapterSpinner.stop(ICONS.done, "Next.js detected");
    log(`${ICONS.gear} Running Next.js setup...`, COLORS.fgBlue);
    require("../scripts/setup-next");
  } else {
    adapterSpinner.warn("No supported framework detected");
    log(`   ${COLORS.dim}Manual adapter setup required for your framework${COLORS.reset}`);
  }

  // 6. Semantic Search Init
  const semanticSpinner = createSpinner("Initializing AI Semantic Search");
  semanticSpinner.start();
  
  const mgrepInitPath = path.join(targetSkillsDir, "workflows", "mgrep-init.sh");
  if (fs.existsSync(mgrepInitPath)) {
    try {
      execSync(`bash "${mgrepInitPath}"`, { stdio: 'pipe' });
      semanticSpinner.stop(ICONS.done, "Semantic search ready");
    } catch (e) {
      semanticSpinner.warn("mgrep watch may need manual start");
    }
  } else {
    semanticSpinner.warn("mgrep-init.sh not found");
  }

  // 7. Finalizing Progress Bar
  console.log("");
  await execWithProgress("", "Finalizing installation", true);

  // Final Summary
  console.log("");
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, COLORS.dim);
  log(`\n${ICONS.fire} ${COLORS.bright}${COLORS.fgGreen}INSTALLATION COMPLETE${COLORS.reset}\n`);
  log(`${COLORS.bright}Next Steps:${COLORS.reset}`);
  log(`  1. Start your dev server: ${COLORS.fgCyan}npm run dev${COLORS.reset}`);
  log(`  2. Append ${COLORS.fgBlue}?grab=true${COLORS.reset} to your browser URL`);
  log(`  3. Hold ${COLORS.bright}Cmd/Ctrl${COLORS.reset} and click any element\n`);
  log(`${COLORS.fgGreen}${COLORS.bright}Go build some god-tier projects.${COLORS.reset}\n`);
}

const command = process.argv[2];
const demoFlag = process.argv.includes("--demo");

if (command === "init") {
  init(demoFlag).catch(err => {
    console.error(`\n${ICONS.fail} Fatal Error:`, err);
    process.exit(1);
  });
} else if (command === "demo") {
  init(true).catch(err => {
    console.error(`\n${ICONS.fail} Fatal Error:`, err);
    process.exit(1);
  });
} else {
  console.log(`
${COLORS.fgCyan}Grabby CLI${COLORS.reset} - High-Performance AI Developer Infrastructure

${COLORS.bright}Usage:${COLORS.reset}
  npx @grabby/cli init         Initialize Grabby in your project
  npx @grabby/cli init --demo  Demo mode (simulates missing dependencies)
  `);
}
