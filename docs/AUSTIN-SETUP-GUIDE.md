# Getting Started — Austin's Setup Guide

This guide walks you through everything you need to set up your computer so you can edit your Faithful Woodworker website. You only need to do this once. After setup, editing your site is as simple as changing some text in a file and pushing a button.

---

## How Your Website Works (The Big Picture)

Your website is a collection of files stored on GitHub (think of it like Google Drive, but for code). When you make changes to those files and "push" them to GitHub, your website automatically updates itself. You don't need to understand the code — all the text, photos, and settings live in simple files that look like organized lists.

**The basic flow:**
1. You edit a file on your computer (text, photos, settings)
2. You "push" the change to GitHub
3. Your website automatically rebuilds and updates (takes about 30 seconds)
4. The live site at https://addison-howenstine.github.io/faithful-woodworker/ shows your changes

---

## Step 1: Create a GitHub Account

GitHub is where your website's files are stored. You need an account to make changes.

1. Go to https://github.com/signup
2. Sign up with your email (austinhowenstine@gmail.com works)
3. Pick a username (suggestion: `austinhowenstine`)
4. Verify your email when they send you one
5. **Tell Addison your GitHub username** so he can give you permission to edit the website

Addison will add you as a "collaborator" on the website's project. You'll get an email invitation — click "Accept" when it arrives.

---

## Step 2: Install the Tools You Need

You need a few free programs installed on your computer. Open the **Terminal** app on your Mac (search for "Terminal" in Spotlight — press Cmd+Space and type "Terminal").

Don't be intimidated by Terminal — you're just going to paste a few commands. Copy each line below, paste it into Terminal, and press Enter.

### Install Homebrew (a tool installer for Mac)

Paste this entire line and press Enter:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

It will ask for your Mac password (the one you use to log in). Type it and press Enter — you won't see the characters as you type, that's normal. This may take a few minutes.

**Important:** When it finishes, it will show some lines under "Next steps" telling you to run commands. Copy and paste those commands too — they make Homebrew work properly.

### Install Node.js and Git

Paste this and press Enter:

```
brew install node git
```

### Install Claude Code (your AI assistant)

Paste this and press Enter:

```
npm install -g @anthropic-ai/claude-code
```

This installs an AI assistant that lives in your Terminal. It can help you edit your website by just talking to it in plain English. More on this below.

---

## Step 3: Set Up Git (One-Time Config)

Git needs to know who you are. Paste these two commands (replace with your actual name and email):

```
git config --global user.name "Austin Howenstine"
git config --global user.email "austinhowenstine@gmail.com"
```

---

## Step 4: Download Your Website Files

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

---

## Step 5: Preview Your Website Locally

Before making changes live, you can preview them on your own computer.

```
npm run dev
```

Then open your web browser and go to: **http://localhost:3000**

You'll see your website running on your computer! Any changes you make to files will show up here automatically (just refresh the page).

**To stop the preview:** Press `Ctrl + C` in Terminal.

**Pro tip:** While the preview is running, you can **Shift+click any text** on the page to edit it directly! Changes save automatically to the files.

---

## Step 6: Understanding What You Can Edit

All the text and settings for your website live in simple files in the `src/content/` folder. Here's what each file controls:

| File | What It Controls |
|------|-----------------|
| `config.json` | Site name, your email, social media links, tagline |
| `home.json` | Homepage text — headline, Disney story section, progress tracker |
| `about.json` | About page — your story paragraphs |
| `portfolio.json` | Portfolio — list of project photos with titles and descriptions |
| `order.json` | Order form — heading text, project types, style options, budget ranges |
| `instagram.json` | Instagram section — which posts and reels to feature |

These files use a format called JSON. It looks like this:

```json
{
  "heading": "About Austin",
  "paragraphs": [
    "First paragraph of your story.",
    "Second paragraph of your story."
  ]
}
```

The rules are simple:
- Text goes inside `"double quotes"`
- Don't delete any `{` `}` `[` `]` or commas — they're structural
- If you're not sure about something, ask Claude Code (see below) or Addison

---

## Step 7: Making Changes and Putting Them Live

After you've edited a file and previewed it locally, here's how to make it live:

### Option A: Using Claude Code (Recommended — Easiest!)

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

### Option B: Manual (if you prefer)

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

---

## Step 8: Adding New Photos

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
