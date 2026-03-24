# Getting Started — Austin's Setup Guide

This guide walks you through everything you need to edit your Faithful Woodworker website. There are multiple ways to do it — pick whichever feels most comfortable. They're listed from easiest to most powerful.

---

## How Your Website Works (The Big Picture)

Your website is a collection of files stored on GitHub (think of it like Google Drive, but for code). When you make changes to those files, your website automatically updates itself. You don't need to understand the code — all the text, photos, and settings live in simple files that look like organized lists.

**The basic flow:**
1. You edit a file (text, photos, settings)
2. You save/commit the change
3. Your website automatically rebuilds and updates (takes about 30 seconds)
4. The live site at https://addison-howenstine.github.io/faithful-woodworker/ shows your changes

---

## First: Create a GitHub Account

No matter which editing method you choose, you need a GitHub account.

1. Go to https://github.com/signup
2. Sign up with your email (austinhowenstine@gmail.com works)
3. Pick a username (suggestion: `austinhowenstine`)
4. Verify your email when they send you one
5. **Tell Addison your GitHub username** so he can give you permission to edit the website

Addison will add you as a "collaborator" on the website's project. You'll get an email invitation — click "Accept" when it arrives.

---

## Choose Your Editing Method

### Method 1: Edit Directly on GitHub.com (Easiest — No Setup At All)

This is the simplest way to make changes. You do everything in your web browser — no apps to install, no Terminal, nothing.

**How to edit text:**

1. Go to https://github.com/addison-howenstine/faithful-woodworker
2. Navigate to the file you want to edit. All the website text lives in the `src/content/` folder. Click `src` → `content` → then the file you want (e.g., `home.json`)
3. Click the **pencil icon** (top right of the file) to edit
4. Make your changes directly in the browser. For example, to change the homepage headline, find `"headline"` and change the text inside the quotes
5. When you're done, scroll down and click **"Commit changes"**
6. In the popup, type a short description of what you changed (e.g., "Updated homepage headline") and click **"Commit changes"** again
7. Your website will automatically update in about 30 seconds!

**What you can edit this way:**
| File | What It Controls |
|------|-----------------|
| `src/content/config.json` | Site name, your email, social media links, tagline |
| `src/content/home.json` | Homepage text — headline, Disney story section, progress tracker |
| `src/content/about.json` | About page — your story paragraphs |
| `src/content/portfolio.json` | Portfolio — list of project photos with titles and descriptions |
| `src/content/order.json` | Order form — heading text, project types, style options, budget ranges |
| `src/content/instagram.json` | Instagram section — which posts and reels to feature |

**Limitations:** You can't preview changes before they go live, and you can't add new photos this way (you'd need Method 2 or 3 for that, or just send photos to Addison). But for changing text, this is all you need.

**Tip:** The files use a format called JSON. The rules are simple:
- Text goes inside `"double quotes"`
- Don't delete any `{` `}` `[` `]` or commas — they're structural
- If you accidentally break something, don't worry — just tell Addison and he can undo it in seconds

---

### Method 2: Use ChatGPT Codex (Easy — AI Makes Changes For You)

If you use ChatGPT, you can connect it to your website and ask it to make changes in plain English. You don't need to understand the files at all — just tell it what you want.

**One-time setup:**

1. Go to https://chatgpt.com
2. Open **Codex** (in the left sidebar, or at chatgpt.com/codex)
3. Click the **GitHub icon** or go to Settings to connect your GitHub account
4. Grant Codex access to the `faithful-woodworker` repository

**Making changes:**

1. Open Codex and type what you want in plain English. Examples:
   - *"Change the homepage headline to 'Handcrafted with Purpose'"*
   - *"Update the Disney progress tracker to 35%"*
   - *"Add this Instagram reel to the website: https://instagram.com/reel/XXXXX"*
   - *"Change my about page bio to say..."*
2. Codex will make the changes and commit them to GitHub
3. Your website automatically updates in about 30 seconds

**Limitations:** Codex doesn't know your website's structure as deeply as Claude Code does (see Method 3), so for complex changes it might need a few tries. For text and content edits, it works great. For anything that seems tricky, ask Addison.

---

### Method 3: Full Local Setup (Most Powerful — Preview Before Publishing)

This gives you the most control. You download the website to your computer, preview changes before they go live, and can use AI (Claude Code) to help you with anything. This requires using the Terminal app, but the instructions below walk you through every step.

**Why you might want this:**
- See exactly what your changes look like before they go live
- Shift+click any text on the page to edit it directly
- Add new photos to the portfolio
- Use Claude Code (AI assistant) in the Terminal for help with anything

#### Install the Tools You Need

You need a few free programs installed on your computer. Open the **Terminal** app on your Mac (search for "Terminal" in Spotlight — press Cmd+Space and type "Terminal").

Don't be intimidated by Terminal — you're just going to paste a few commands. Copy each line below, paste it into Terminal, and press Enter.

##### Install Homebrew (a tool installer for Mac)

Paste this entire line and press Enter:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

It will ask for your Mac password (the one you use to log in). Type it and press Enter — you won't see the characters as you type, that's normal. This may take a few minutes.

**Important:** When it finishes, it will show some lines under "Next steps" telling you to run commands. Copy and paste those commands too — they make Homebrew work properly.

##### Install Node.js and Git

Paste this and press Enter:

```
brew install node git
```

##### Install Claude Code (your AI assistant — optional but recommended)

Paste this and press Enter:

```
npm install -g @anthropic-ai/claude-code
```

This installs an AI assistant that lives in your Terminal. It can help you edit your website by just talking to it in plain English. More on this below. (Requires a Claude/Anthropic account — if you don't have one, skip this and use the other methods above.)

#### Set Up Git (One-Time Config)

Git needs to know who you are. Paste these two commands (replace with your actual name and email):

```
git config --global user.name "Austin Howenstine"
git config --global user.email "austinhowenstine@gmail.com"
```

#### Download Your Website Files

Now you're going to "clone" (download) your website to your computer.

1. In Terminal, go to a folder where you want to keep the website. Your Documents folder is fine:

```
cd ~/Documents
```

2. Download the website:

```
git clone https://github.com/addison-howenstine/faithful-woodworker.git
```

3. Go into the website folder:

```
cd faithful-woodworker
```

4. Install the website's dependencies (things it needs to run):

```
npm install
```

This will take a minute. You only need to do this once (unless Addison tells you to run it again).

#### Preview Your Website Locally

Before making changes live, you can preview them on your own computer.

```
npm run dev
```

Then open your web browser and go to: **http://localhost:3000**

You'll see your website running on your computer! Any changes you make to files will show up here automatically (just refresh the page).

**To stop the preview:** Press `Ctrl + C` in Terminal.

**Pro tip:** While the preview is running, you can **Shift+click any text** on the page to edit it directly! Changes save automatically to the files.

#### Making Changes and Putting Them Live

After you've edited a file and previewed it locally, here's how to make it live:

##### Option A: Using Claude Code (Recommended!)

1. Make sure you've stopped the preview first (`Ctrl + C`)
2. In Terminal, make sure you're in the website folder:
   ```
   cd ~/Documents/faithful-woodworker
   ```
3. Start Claude Code:
   ```
   claude
   ```
4. Just tell it what you want in plain English! Examples:
   - *"Push my changes to make the website live"*
   - *"I want to change the headline on the homepage to 'Handcrafted with Purpose'"*
   - *"Add a new photo to the portfolio called family-sign.jpg with the title 'Custom Family Sign'"*
   - *"Update the Disney progress tracker to 25%"*
   - *"Add this Instagram reel to the website: https://instagram.com/reel/XXXXX"*

Claude Code will make the changes, show you what changed, and push it live for you. It reads the CLAUDE.md file in this project so it knows exactly how your site works.

##### Option B: Manual Git Commands

1. In Terminal, in the website folder:

```
git add -A
```
This tells Git "I want to save all my changes."

2. Describe what you changed:

```
git commit -m "Updated homepage headline"
```
Put a short description of what you changed inside the quotes.

3. Push it live:

```
git push
```

Your website will automatically update in about 30 seconds.

#### Adding New Photos

To add a new project photo to your portfolio:

1. Save the photo to the `public/photos/portfolio/` folder inside your website folder
   - **Name it with dashes, no spaces**: `family-name-sign.jpg` (not `Family Name Sign.jpg`)
   - Use `.jpg` or `.png` format

2. Open `src/content/portfolio.json` and add a new entry to the list. You can ask Claude Code to do this for you:
   *"Add a new portfolio photo called family-name-sign.jpg with the title 'Custom Family Name Sign' in the sign category"*

---

## Common Tasks — Quick Reference

| I want to... | What to do |
|--------------|-----------|
| Preview my site | `npm run dev` then go to http://localhost:3000 |
| Stop the preview | Press `Ctrl + C` in Terminal |
| Edit text on the site | Shift+click any text while preview is running |
| Change the Disney progress | Edit `src/content/home.json` → `progressTracker.percentage` |
| Add a portfolio photo | Drop photo in `public/photos/portfolio/`, add entry to `portfolio.json` |
| Add an Instagram reel | Add URL to `src/content/instagram.json` → `reels` array |
| Push changes live | `git add -A && git commit -m "description" && git push` |
| Ask for AI help | Run `claude` in the website folder |
| Check if site updated | Visit https://addison-howenstine.github.io/faithful-woodworker/ |

---

## If Something Goes Wrong

**"I messed up a file and the site looks broken"**
- Don't panic! Run `git checkout -- .` to undo all your changes and go back to the last working version
- Or just tell Claude Code: *"Undo all my changes"*

**"I can't push — it says something about 'pull first'"**
- Run `git pull` first, then try pushing again
- This happens when Addison made changes while you were also making changes

**"The preview won't start"**
- Make sure you're in the right folder: `cd ~/Documents/faithful-woodworker`
- Try running `npm install` again
- Ask Addison if it still doesn't work

**"I don't know how to do something"**
- Start Claude Code (`claude` in Terminal) and ask in plain English
- Or text Addison!

---

## What NOT to Touch

These files make the website work. Don't edit them unless Addison tells you to:
- Anything in `src/app/` (the page code)
- Anything in `src/components/` (the building blocks)
- `package.json`, `next.config.ts`, `tsconfig.json` (settings files)
- `.github/` folder (deployment automation)

**You should only need to edit files in `src/content/` and add photos to `public/photos/`.**

If you want to change how something looks or works (not just the text), ask Addison. He'll either do it or walk you through it.
