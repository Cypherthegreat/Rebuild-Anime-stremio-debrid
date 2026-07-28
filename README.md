# Rebuild of Naruto x One Pace x One Piece Kai Stremio Debrid Addon

Join the [#onepace:garnier.dev](https://matrix.to/#/#onepace:garnier.dev) Matrix channel to receive updates when new episodes are released!

## Overview

[Stremio](https://www.stremio.com) is a modern media center that gives you the freedom to watch everything you want.\
Thanks to its addon system, it allows accessing a variety of content.

[Rebuild of Naruto](https://discord.gg/JEUpfrfnnq)
Rebuild of Naruto is a complete reedit, restructure, and overall enhancement of the Naruto anime. The goal of this project is to create the definitive viewing experience for both old fans and new. Like other fan edits, this project removes most filler and removes padding/fluff from the anime like unnecessary exposition, repetitive flashbacks, elongated shots, and so on Unlike other fan edits, however, trimming down the anime is just a byproduct of everything else offered in this project.

The main selling point with Rebuild of Naruto is the narrative restructuring. Fans who have finished either the manga or anime should be rather familiar with how often Kishimoto changed details of the story over the course of the manga. However, what's truly remarkable about Kishimoto as a storyteller is that he managed to make even the most drastic changes without making many retcons (changing events we have already seen to support new information). Instead, he used flashbacks to either show us new scenes that occurred during sections of the story we had already seen, or to reveal new information through the perspective of another character. This method of "retconning" was fantastic when the story was unfolding, but now that the story is over, this method has unfortunately left quite a sloppy mess of the chronology. That is what this project aims to correct: to enhance the storytelling of the anime with the benefit of hindsight.

To go along with this restructuring, each individual "arc" of the show is presented as a movie or series of movies. Episode in a story arc are seamlessly stitched together to create a naturally flowing feature film. 

Filler?
As mentioned, I am cutting most filler. The filler arcs/scenes that are included in this project have been hand-selected as ones that I believe add to character development or the world-building in a meaningful way.

Will this cover Shippuden?
Yes, this covers Shippuden. 

Will this cover Boruto? 
As of right now, I have no plans to do a cut of Boruto. If I do ever create one, it will be after the show has concluded and the English Dub has been released.

Is this also in English?
Yes! This project offers dual-audio tracks and English subtitles for the Japanese audio. (edited)Monday, 16 

[One Pace](https://onepace.net) is a fan project that recuts One Piece to bring it more in line with the pacing of the original manga by Eiichiro Oda.\
It is distributed through torrent files on their website, which can be cumbersome to watch, and is missing some parts.

[One Piece Kai](https://www.reddit.com/comments/mbsv0n/) is another fan project made by [u/Emigliore (NSFW)](https://www.reddit.com/user/Emigliore) in March 2021, similar to One Pace but without any missing part.\
It stops after the first "half" of the One Piece anime though, and has Japanese audio with hardcoded English subtitles[^1].

[^1]: An older [English dub](https://www.reddit.com/comments/g7aro3/) also exists if you prefer – [updated](https://www.reddit.com/comments/17phccc/) in November 2023 (up to the first half of Wano).

This fork continues the addon with debrid integration support, especially for Torbox, while keeping the project maintained going forward.\
It brings all three together to provide the optimal Naruto and One Piece watching experience.\
You will see a new One Piece series on Stremio which contains One Pace, with missing parts filled in from One Piece Kai.\
It is automatically kept up to date with the latest releases nightly.

## Usage

First of all, you will need [Stremio](https://www.stremio.com/downloads).\
It is available on Windows, macOS, Linux, Android TV, Samsung TV, Android, Stream Deck, and web browsers.\
The iOS version only allows seeing episodes' metadata but not streaming due to App Store regulations.

Please note:

- This addon does not work well alongside previous versions. Uninstall any other One Pace addon before using this one.
- Subtitles might not work properly on Android. Go to Settings -> Player -> Switch to LibVLC for a much better experience.
- Some One Pace episodes are dubbed in English. Change your preferred language in Stremio settings to set the default track.

### Quick Install

1. Log into [Stremio for Browser](https://app.strem.io) with the same account you will use on your device.
2. [Click HERE](https://app.strem.io/#/addons/community/all?addon=https%3A%2F%2Fonepace.arl.sh%2Fmanifest.json) and hit the `Install` button.
3. One Pace should now be available in the `Discover` tab or [here](https://app.strem.io/#/detail/series/onepace/).
4. The addon will synchronize with any other device under the same account so you can watch from anywhere.

### Manual Install

1. Go to Stremio's `Addons` tab.
2. In `Search addons`, paste the following link: `https://onepace.arl.sh/manifest.json`.
3. Hit the `Install` button.
4. One Pace should now be available in the `Discover` tab.

## Addon History

[fedew04](https://github.com/fedew04) created the original version of this addon in December 2022 before joining the One Pace team, not including One Piece Kai.\
It is hosted on GitHub and is still maintained manually with new releases: [fedew04/OnePaceStremio](https://github.com/fedew04/OnePaceStremio).

[vasujain275](https://github.com/vasujain275) developed another addon in parallel in July 2023 which shows the latest One Pace episodes in real time.\
It is hosted on [BeamUp](https://github.com/Stremio/stremio-beamup) and the source code is available on GitHub: [vasujain275/onepace-stremio-v2](https://github.com/vasujain275/onepace-stremio-v2).

[roshank231](https://github.com/roshank231) forked the original addon in August 2023, integrating One Piece Kai episodes to fill in missing sections in One Pace.\
This second version is also available on GitHub but is no longer actively maintained: [roshank231/optest](https://github.com/roshank231/optest).

I, [au2001](https://github.com/au2001), then started improving on this third addon in October 2023 by updating it with newly released One Pace episodes.\
[trulow](https://github.com/trulow) further helped maintain it by adding new episodes as they were being released.

In January 2024, I automated the update process for adding new One Pace episodes, removing the need for manual intervention.\
In March 2024, I then created the Matrix channel to receive notifications when new episodes are released.\
In April 2024, One Pace changed their website very slightly which temporarly broke the automated updates. I switched to a more robust method using the official GraphQL API which I discovered through [vasujain275](https://github.com/vasujain275)'s addon.\
In July 2024, One Pace's website got taken down with its GraphQL API, breaking automated updates for over a year.\
In September 2025, I finally restored automated updates by using the official Google Sheets documents, waiting for a new GraphQL API.

On 12 April 2026, [vasujain275](https://github.com/vasujain275) forked this project as [onepace-stremio-debrid](https://github.com/vasujain275/onepace-stremio-debrid) to add debrid integration—especially Torbox support—and continue maintaining it into the future.

Thank you to everyone involved, especially [One Pace volunteers](https://onepace.net/about) for their incredible, ongoing effort.

## Support

If you encounter any problem or have questions, feel free to open an [Issue](https://github.com/vasujain275/onepace-stremio-debrid/issues) on this repository.\
Enhancements and bug fixes are welcome through [Pull Requests](https://github.com/vasujain275/onepace-stremio-debrid/pulls) on this repository.
