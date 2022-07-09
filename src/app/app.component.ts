// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Component, Inject, OnInit } from '@angular/core'
import { ShareLink } from './shareLinkUrl'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly DEFAULT_BANNER_DESCRIPTION: string = "Safer, faster, and more stable"
  readonly ANDROID_CHROME_CLICK_DESCRIPTION = "Click to open link with Banana browser"

  readonly PACKAGE_ID = "org.triple.banana"
  readonly DEFAULT_WAIT_TIME_MS = 300

  readonly TRIPLE_BANANA_DEV_URL = "https://triplebanana.dev"
  readonly PLAYSTORE_URL = "https://play.google.com/store/apps/details"

  bannerDescription = this.DEFAULT_BANNER_DESCRIPTION

  private shareLink: ShareLink

  private location: Location

  constructor(
    @Inject('Location') location: Location
  ) {
    this.location = location
    this.shareLink = this.getShareLinkUrl()
  }

  ngOnInit(): void {
    this.processShareLink()
  }

  onBannerClicked() {
    this.gotoLinkOrStore()
  }

  private processShareLink() {
    if (!this.shareLink.getUrl()) {
      console.error("Failed to parse banana link : " + this.location.toString())
      this.navigate(this.TRIPLE_BANANA_DEV_URL)
      return
    }

    this.gotoLinkOrStore()
  }

  private gotoLinkOrStore() {
    const userAgent = this.getUserAgent();
    if (userAgent.match(/Android/)) {
      if (userAgent.match(/Chrome/)) {
        this.handleChrome()
      } else {
        this.handleOtherBrowsers()
      }
    }
    else {
      this.navigate(this.shareLink.getUrl())
    }
  }

  private getShareLinkUrl(): ShareLink {
    return new ShareLink(this.location.href)
  }

  private handleChrome() {
    this.bannerDescription = this.ANDROID_CHROME_CLICK_DESCRIPTION
    this.navigate(
      this.generateAndroidIntent(
        this.shareLink.getProtocol(),
        this.shareLink.getUrlWithoutProtocol(),
        this.PACKAGE_ID)
    )
  }

  private handleOtherBrowsers() {
    setTimeout(() => {
      this.navigate(this.generatePlayStoreLinkUrl(this.PACKAGE_ID))
    }, this.DEFAULT_WAIT_TIME_MS)

    this.navigateWithIframe()
  }

  // traditional method navigate url using iframe
  private navigateWithIframe(): void {
    const iframe = document.createElement('iframe')
    iframe.style.visibility = 'hidden'
    iframe.src = this.generateAndroidIntent(
      this.shareLink.getProtocol(),
      this.shareLink.getUrlWithoutProtocol(),
      this.PACKAGE_ID
    )
    document.body.appendChild(iframe);
    document.body.removeChild(iframe);
  }

  private navigate(url: string) {
    this.location.href = url
  }

  private getUserAgent(): string {
    return navigator.userAgent
  }

  private generateAndroidIntent(scheme: string, url: string, packageId: string): string {
    return `intent://${url}#Intent;scheme=${scheme};package=${packageId};S.browser_fallback_url=${url};action=android.intent.action.VIEW;end;`
  }

  private generatePlayStoreLinkUrl(packageId: string) {
    return `${this.PLAYSTORE_URL}?id=${packageId}`
  }
}
