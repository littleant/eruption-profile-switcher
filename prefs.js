/*
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright (c) 2019-2025, The Eruption Development Team
 */

"use strict";

import Adw from 'gi://Adw';

import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class EruptionProfileSwitcherPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    window._settings = this.getSettings();

    const page = new Adw.PreferencesPage();

    const group = new Adw.PreferencesGroup();

    group.add(buildPrefsWidget(this));

    page.add(group);

    window.add(page);
  }
}

function buildPrefsWidget(conf) {
  const builder = new Gtk.Builder();

  builder.set_scope(new MyBuilderScope(conf));
  builder.set_translation_domain("eruption-profile-switcher@x3n0m0rph59.org");
  builder.add_from_file(conf.path +"/prefs.ui");

  const provider = new Gtk.CssProvider();

  provider.load_from_path(conf.path +"/stylesheet.css");
  Gtk.StyleContext.add_provider_for_display(
    Gdk.Display.get_default(),
    provider,
    Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION,
  );

  const settings = conf.getSettings();

  builder
    .get_object("enable_notifications_general")
    .set_active(settings.get_boolean("notifications-general"));
  builder
    .get_object("enable_notifications_on_profile_switch")
    .set_active(settings.get_boolean("notifications-on-profile-switch"));
  builder
    .get_object("enable_notifications_on_hotplug")
    .set_active(settings.get_boolean("notifications-on-hotplug"));
  builder
    .get_object("enable_notifications_on_settings_change")
    .set_active(settings.get_boolean("notifications-on-settings-change"));

  builder
    .get_object("compact_mode")
    .set_active(settings.get_boolean("compact-mode"));
  builder
    .get_object("show_battery_level")
    .set_active(settings.get_boolean("show-battery-level"));
  builder
    .get_object("show_signal_strength")
    .set_active(settings.get_boolean("show-signal-strength"));

  builder
    .get_object("show_device_indicators")
    .set_active(settings.get_boolean("show-device-indicators"));
  builder
    .get_object("show_device_indicators_percentages")
    .set_active(settings.get_boolean("show-device-indicators-percentages"));

  return builder.get_object("main_prefs");
}

// const PrefsWidget = GObject.registerClass(
//   {
//     GTypeName: "PrefsWidget",
//     Template: conf.dir.get_child("prefs.ui").get_uri(),
//   },
//   class PrefsWidget extends Gtk.Box {
//     _init(conf, params = {}) {
//       super._init(conf, params);
//     }
//   },
// );

const MyBuilderScope = GObject.registerClass(
  {
    Implements: [Gtk.BuilderScope],
  },
  class MyBuilderScope extends GObject.Object {
    constructor(conf) {
      super();

      this.conf = conf;
    }
    vfunc_create_closure(_builder, handlerName, flags, connectObject) {
      if (flags & Gtk.BuilderClosureFlags.SWAPPED) {
        throw new Error("Unsupported template signal flag 'swapped'");
      }

      if (typeof this[handlerName] === "undefined") {
        throw new Error(`${handlerName} is undefined`);
      }

      return this[handlerName].bind(connectObject || this);
    }

    on_enable_notifications_general_toggled(w) {
      const settings = this.conf.getSettings();
      settings.set_boolean("notifications-general", w.get_active());
    }

    on_enable_notifications_on_profile_switch_toggled(w) {
      const settings = this.conf.getSettings();
      settings.set_boolean("notifications-on-profile-switch", w.get_active());
    }

    on_enable_notifications_on_hotplug_toggled(w) {
      const settings = this.conf.getSettings();
      settings.set_boolean("notifications-on-hotplug", w.get_active());
    }

    on_enable_notifications_on_settings_change_toggled(w) {
      const settings = this.conf.getSettings();
      settings.set_boolean("notifications-on-settings-change", w.get_active());
    }

    on_compact_mode_toggled(w) {
      const settings = this.conf.getSettings();
      settings.set_boolean("compact-mode", w.get_active());
    }

    on_show_battery_level_toggled(w) {
      const settings = this.conf.getSettings();
      settings.set_boolean("show-battery-level", w.get_active());
    }

    on_show_signal_strength_toggled(w) {
      const settings = this.conf.getSettings();
      settings.set_boolean("show-signal-strength", w.get_active());
    }

    on_show_device_indicators_toggled(w) {
      const settings = this.conf.getSettings();
      settings.set_boolean("show-device-indicators", w.get_active());
    }

    on_show_device_indicators_percentages_toggled(w) {
      const settings = this.conf.getSettings();
      settings.set_boolean(
        "show-device-indicators-percentages",
        w.get_active(),
      );
    }
  },
);
