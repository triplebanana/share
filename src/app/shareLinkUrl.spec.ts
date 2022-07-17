// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ShareLink } from './shareLinkUrl'

describe('ShareLink', () => {
  it('should parse share link', () => {
    const bananaShareLink = "https://triplebanana.dev?sharelink=https://www.google.co.kr/imghp?hl=ko&ogbl"
    const shareLink = new ShareLink(bananaShareLink)

    expect(shareLink.getUrl()).toEqual("https://www.google.co.kr/imghp?hl=ko&ogbl")
    expect(shareLink.getProtocol()).toEqual("https")
    expect(shareLink.getUrlWithoutProtocol()).toEqual("www.google.co.kr/imghp?hl=ko&ogbl")
  })

  it('should return empty url if not contain sharelink url', () => {
    const notContainedShareUrl = "https://www.google.co.kr/imghp?hl=ko&ogbl"
    const shareLink = new ShareLink(notContainedShareUrl)

    expect(shareLink.getUrl()).toEqual("")
    expect(shareLink.getProtocol()).toEqual("")
    expect(shareLink.getUrlWithoutProtocol()).toEqual("")
  })

})
