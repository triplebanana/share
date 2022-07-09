import { AndroidChromeBrowser } from "./android-chrome-browser";
import { AndroidBrowser } from "./android-browser";
import { DefaultBrowser } from "./default-browser";
import { Browser } from "./browser";
// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Navigator } from "../navigator/navigator";

export class BrowserFactory {

  static getBrowser(navigator: Navigator): Browser {
    const userAgent = this.getUserAgent();
    if (userAgent.match(/Android/)) {
      if (userAgent.match(/Chrome/)) {
        return new AndroidChromeBrowser(navigator)
      } else {
        return new AndroidBrowser(navigator)
      }
    }
    return new DefaultBrowser(navigator)
  }

  private static getUserAgent(): string {
    return navigator.userAgent
  }
}
