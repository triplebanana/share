// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Browser } from "./browser";
import { ShareLink } from '../shareUrl/sharelink-url';
import { Navigator } from "../navigator/navigator";

export class AndroidBrowser implements Browser {

  static readonly PACKAGE_ID = "org.triple.banana"
  static readonly PLAYSTORE_URL = "https://play.google.com/store/apps/details"

  constructor(private navigator: Navigator) {
  }

  navigate(shareLink: ShareLink): void {
    setTimeout(() => {
      this.navigator.navigate(AndroidBrowser.generatePlayStoreLinkUrl(AndroidBrowser.PACKAGE_ID))
    }, 300)
    this.navigateWithIframe(shareLink)
  }

  static generateAndroidIntent(scheme: string, url: string, packageId: string): string {
    return `intent://${url}#Intent;scheme=${scheme};package=${packageId};S.browser_fallback_url=${url};action=android.intent.action.VIEW;end;`
  }

  static generatePlayStoreLinkUrl(packageId: string): string {
    return `https://play.google.com/store/apps/details?id=${packageId}`
  }

  private navigateWithIframe(shareLink: ShareLink): void {
    const iframe = document.createElement('iframe')
    iframe.style.visibility = 'hidden'
    iframe.src = AndroidBrowser.generateAndroidIntent(
        shareLink.getProtocol(),
        shareLink.getUrlWithoutProtocol(),
        AndroidBrowser.PACKAGE_ID
    )
    document.body.appendChild(iframe);
    document.body.removeChild(iframe);
  }
}
