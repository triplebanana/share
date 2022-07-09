// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Browser } from "./browser";
import { ShareLink } from '../shareUrl/sharelink-url';
import { AndroidBrowser } from "./android-browser";
import { Navigator } from "../navigator/navigator";

export class AndroidChromeBrowser extends AndroidBrowser implements Browser {

  constructor(private _navigator: Navigator) {
    super(_navigator)
  }

  override navigate(shareLink: ShareLink): void {
    this._navigator.navigate(AndroidBrowser.generateAndroidIntent(
      shareLink.getProtocol(),
      shareLink.getUrlWithoutProtocol(),
      AndroidBrowser.PACKAGE_ID
    ))
  }
}
