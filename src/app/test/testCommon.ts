// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export class TestCommon {
  static readonly USER_AGENT_ANDROID_CHROME_BROWSER =
    "Mozilla/5.0 (Linux; Android 12; SM-G996N) \
    AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36"

  static readonly USER_AGENT_ANDROID_WEB_VIEW =
    "Mozilla/5.0 (Android; Mobile; rv:13.0) \
    Gecko/13.0 Firefox/13.0"

  static readonly USER_AGENT_LINUX_CHROME =
    "Mozilla/5.0 (X11; Linux x86_64) \
    AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36"

  static readonly TRIPLE_BANANA_SHARE_URL = "https://triplebanana.dev/share"

  static generateTestShareLink(url: string) {
    return `${TestCommon.TRIPLE_BANANA_SHARE_URL}?sharelink=${url}`
  }

  static mockUserAgent(userAgent: string) {
    spyOnProperty(navigator, 'userAgent').and.returnValue(userAgent)
  }
}
