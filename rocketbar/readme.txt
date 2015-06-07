=== The RocketBar ===
Contributors: Code by Jinx
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YS46UW6PLH286
Tags: switch, rocketbar, spotlight, search, quick, fast, dashboard, commands, admin, widget
Requires at least: 3.2
Tested up to: 4.2.2
Stable tag: 150607
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html

The quicker page switcher!? Keyboard shortcuts for your WordPress Dashboard.


== Description ==

The RocketBar is a new, faster (FREE) way to get around in WordPress. Instead of clicking from page to page, just hit a keyboard shortcut and immediately
go where you're headed!

The plugin is designed after the OSX Spotlight Search feature, and uses a keybind of `SHIFT + SPACE` to open.

### Why should you LOVE RocketBar?

RocketBar enables you (the site owner) access to a faster WordPress. With RocketBar, you can spend more time checking analytics and stats, moderating
comments, and adding content, and less time finding where you need to go.

With a robust code base, leveraging WordPress's hosted CSS and jQuery, you won't be slowed down by our bite-sized client-side code base.

Using RocketBar is simple. No setup necessary. Just install and go!

### What's Next?

To track the development of RocketBar, find us on [GitHub](https://github.com/byjinx/rocketbar)!

**The following items are being looked at for additions to a future version of RocketBar:**

 - Command API for personal modifications (This is complete, but yet to be documented.)
 - Quick selects (`SHIFT + NUM` to select an option from the list)
 - Even better fuzzy matching
 - Plugin-specific integrations (such as BuddyPress, bbPress, and various caching plugins)
 - Bar Themes

---

If you would like to suggest an addition or change, tell us in the Support forums!


== Installation ==

1. Search for RocketBar in the WordPress Dashboard
1. Install and Activate

OR

1. Upload plugin to your `wp-content/plugins` directory
1. Activate via the WordPress Dashboard


== Frequently Asked Questions ==

= What's the keybinding for RocketBar? =

That's `SHIFT + SPACE`. :-)

= Can I use the RocketBar on the front side of my site? =

Yep! You can use it anywhere within your WordPress installation!

= Can my Users / Visitors see the bar? =

No, only Administrators (or, more precisely, Users with the `manage_options` Capability) can see the RocketBar

= This plugin made my ability to move around in WordPress too fast. How can I slow down? =

There's no turning back now. You're one of us.


== Screenshots ==

1. The RocketBar administration panel
1. The RocketBar's default links
1. Example use of The RocketBar

== Changelog ==

= 150517 =
* First release of RocketBar. Much more to come.

= 150523 =
* Fixed an issue with loading the client-side resources for the plugin, as pointed out by the WordPress.org team

= 150524 =
* Login/Logout commands, and a powerful API function for your use!

= 150524-2 =
* Command upgrade

= 150525 =
* Fixed bug where opening RocketBar put a space into the search field
* Fixed bug where you could go too far down with the `arrow down` key
* NEW: RocketBar now has documentation on the current commands available under `Tools -> RocketBar`.
* NEW: Search Google Feature -- As a default feature, RocketBar will now give you the option to search for anything you put into the bar
* NEW: Navigate to -- Type in `/`, and URI afterwards and hit `ENTER`. Now you'll go to that area of your site. :-)
* NEW: Default links when opening the RocketBar.

= 150526 =
* Some subtle changes to command descriptions
* Updating the way we search via Google

= 150529 =
* Updating fuzzy matching for better search results
* Adding `home` command for easy access to site home url
* Adding `g` command for direct access to Google Search

= 150607 =
* Various changes to global objects to help prevent issues with plugin compatibility
* Changed to CSS/ISO identifier for newline character within bar for better cross-browser compatibility
* RocketBar now uses only one global object. `document.rocketBar`

== Upgrade Notice ==

= 150517 =
First release of RocketBar

= 150523 =
Initial WordPress.org release of RocketBar

= 150524 =
Commands update! Upgrade ASAP!

= 150524-2 =
Some hotfixes to commands + a bit of an upgrade!

= 150525 =
Bug fixes, New features + Maintenance Release

= 150526 =
Maintenance Release

= 150529 =
Maintenance Release

= 150607 =
Maintenance Release
