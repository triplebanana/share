// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export class ShareLink {
  static readonly SHARE_LINK_PARAM = "?sharelink="

  private protocol: string = ""
  private shareUrl: string = ""
  private urlWithoutProtocol: string = ""

  constructor(bananaShareUrl: string) {
    const shareLink = this.parseShareLink(bananaShareUrl)
    if (!shareLink) return

    this.shareUrl = shareLink
    this.protocol = this.parseProtocol(shareLink)
    this.urlWithoutProtocol = this.shareUrl.replace(this.protocol+"://", "")
  }

  getUrl(): string {
    return this.shareUrl
  }

  getProtocol(): string {
    return this.protocol
  }

  getUrlWithoutProtocol(): string {
    return this.urlWithoutProtocol
  }

  private parseShareLink(fullUrl: string): string {
    const shareLinkIndex = fullUrl.indexOf(ShareLink.SHARE_LINK_PARAM)
    if (shareLinkIndex === -1) return ""

    return fullUrl.substring(shareLinkIndex + ShareLink.SHARE_LINK_PARAM.length)
  }

  private parseProtocol(shareLinkUrl: string): string {
    return shareLinkUrl.startsWith("https") ? "https" : "http"
  }
}
