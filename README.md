# MEMENTO MORI calendar wallpaper

A minimalist life calendar for [Wallpaper Engine](https://www.wallpaperengine.io/). Every square is one week of your life: one row is one year (52 weeks), starting on your birthday. Weeks you have already lived are filled in, the current week glows, and the remaining weeks fade into the background.

Steam Workshop: https://steamcommunity.com/sharedfiles/filedetails/?id=2986436976

![MEMENTO MORI calendar wallpaper](https://steamuserimages-a.akamaihd.net/ugc/2057628900476690626/3CE0F3BA7BD2C8D237424DA3B59C6A1B7BE1C93F/?)

## What the wallpaper shows

- **Header**: the title and four statistics: your age, weeks lived, weeks left and the percentage of your life lived, with a thin progress bar underneath.
- **Calendar**: years grouped by decade, with age labels on the left and week numbers on top. The calendar is split into blocks placed side by side (for example ages 0–39 and 40–79), so it uses the full width of the monitor.
- **Footer**: a legend (lived / this week / remaining) and a random stoic quote that changes every 24 hours.

The calendar scales itself to the screen resolution. Every cell and gap is sized in whole pixels, so all squares are exactly the same size and every column lines up. The calendar refreshes every hour, so it moves to the next week without restarting the wallpaper.

## Settings

All options live in Wallpaper Engine's wallpaper properties panel (on the right after you select the wallpaper). You don't edit anything on the wallpaper itself.

**Date of birth**

| Property | Description |
| --- | --- |
| Day / Month / Year | Your date of birth. Invalid dates such as 31 February are clamped to the last day of the month. |
| Life expectancy (years) | The number of years (rows) in the calendar, from 40 to 120. The default is 80. |

**Appearance**

| Property | Description |
| --- | --- |
| Theme | Ash, Midnight, Paper, Crimson, Forest or **Custom**. |
| Background / Text / Lived weeks / Current week / Remaining weeks color | Only shown when the theme is set to Custom. |
| Cell shape | Square, Rounded or Circle. |
| Calendar layout | **Auto** picks the number of side-by-side blocks that gives the largest cells for your screen. You can also force 1–4 columns. |
| Calendar size (%) | Shrinks the calendar if you want more empty space around it. |
| Pulse current week | Animates the current week. |

**Content**

| Property | Description |
| --- | --- |
| Title | Custom heading text. Leave it empty to hide the title. |
| Show statistics | Shows the age, weeks and percentage, plus the progress bar. |
| Show age / week labels | Shows the decade labels and week numbers. |
| Show daily quote | Shows the random quote at the bottom. |
| Show legend | Shows the color legend at the bottom. |

## Project structure

| File | Purpose |
| --- | --- |
| `project.json` | Wallpaper Engine project file. It defines all the user properties listed above. |
| `index.html` | Page layout: header, calendar and footer. |
| `style.css` | Styling; colors and sizes are CSS variables. |
| `app.js` | Week calculation, auto layout and the `wallpaperPropertyListener` that receives the settings from Wallpaper Engine. |
| `quotes.js` | The list of quotes. |

## Development

The scripts are ES modules, so open the page through a local web server rather than from `file://`:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/?birth=1995-06-15`. The `birth` parameter sets the date of birth when the page runs outside Wallpaper Engine.

To test it in Wallpaper Engine, copy the folder into Wallpaper Engine's `projects/myprojects` directory, or open `index.html` from the Wallpaper Engine editor. The project also needs a `preview.jpg` (or `.gif`) next to `project.json`.
