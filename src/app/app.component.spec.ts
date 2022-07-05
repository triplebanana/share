// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  const TRIPLE_BANANA_SHARE_URL = "https://triplebanana.dev/share"

  const USER_AGENT_ANDROID_CHROME_BROWSER =
    "Mozilla/5.0 (Linux; Android 12; SM-G996N) \
    AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36"
  const USER_AGENT_ANDROID_KAKAOTALK_WEB_VIEW =
    "Mozilla/5.0 (Android; Mobile; rv:13.0) \
    Gecko/13.0 Firefox/13.0 KAKAOTALK"

  const USER_AGENT_LINUX_CHROME =
    "Mozilla/5.0 (X11; Linux x86_64) \
    AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36"

  it('should move android intent including target url when use chrome browser', fakeAsync(() => {
    // given
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const shareUrl = "https://google.com"
    spyOn<any>(app, 'getCurrentUrl').and.returnValue(generateShareLink(shareUrl))
    const moveToUrl = spyOn<any>(app, 'moveToUrl')
    spyOnProperty(navigator, 'userAgent').and.returnValue(USER_AGENT_ANDROID_CHROME_BROWSER)

    // when
    fixture.detectChanges()
    tick()

    // then
    const calledIntent = new URL(moveToUrl.calls.mostRecent().args[0] as string)
    expect(calledIntent.protocol).toEqual("intent:")
    expect(calledIntent.pathname.includes("google.com")).toBeTruthy()
  }));

  it('should move android intent including \
    target url when use not chrome browser via iframe', fakeAsync(() => {
    // given
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const shareUrl = "https://google.com"

    spyOn<any>(app, 'getCurrentUrl').and.returnValue(generateShareLink(shareUrl))

    const moveToUrlWithIframe = spyOn<any>(app, 'moveToUrlWithIframe')
      .and.callFake((url: string): void => console.log("do not move for test"))

    const moveToUrl = spyOn<any>(app, 'moveToUrl')
      .and.callFake((url: string) => console.log("do not move for test"))

    spyOnProperty(navigator, 'userAgent')
      .and.returnValue(USER_AGENT_ANDROID_KAKAOTALK_WEB_VIEW)

    // when
    fixture.detectChanges()
    tick()

    // then
    expect(moveToUrlWithIframe).toHaveBeenCalled()

    // after few time, means failed to move with intent then should move to playstore
    tick(app.DEFAULT_WAIT_TIME_MS)

    const playStoreUrl = moveToUrl.calls.mostRecent().args[0]
    expect(moveToUrl).toHaveBeenCalled()
    expect(playStoreUrl).toEqual(`${app.PLAYSTORE_URL}?id=${app.PACKAGE_ID}`)
  }));

  it('should just move to target url if not android platform', fakeAsync(() => {
    // given
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const shareUrl = new URL("https://google.com")

    spyOn<any>(app, 'getCurrentUrl').and.returnValue(generateShareLink(shareUrl.toString()))

    spyOnProperty(navigator, 'userAgent')
      .and.returnValue(USER_AGENT_LINUX_CHROME)

    const moveToUrl = spyOn<any>(app, 'moveToUrl')

    // when
    fixture.detectChanges()
    tick()

    // then
    const moveUrl = new URL(moveToUrl.calls.mostRecent().args[0] as string)
    expect(moveUrl.protocol).toEqual(shareUrl.protocol)
    expect(moveUrl.pathname).toEqual(shareUrl.pathname)
  }));

  it('should move to banana dev page if invalid sharelink', fakeAsync(() => {
    // given
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // shareUrl without "shareLink" param
    const shareUrl = window.location.toString()
    spyOn<any>(app, 'getCurrentUrl').and.returnValue(shareUrl)

    const moveToUrl = spyOn<any>(app, 'moveToUrl')

    // when
    fixture.detectChanges()
    tick()

    // then
    const moveUrl = moveToUrl.calls.mostRecent().args[0] as URL
    expect(moveUrl.toString()).toEqual(app.TRIPLE_BANANA_DEV_URL)
  }));

  function generateShareLink(url: string) {
    return `${TRIPLE_BANANA_SHARE_URL}?sharelink=${url}`
  }

  function assertCalledIntent(intent: string, expectedUrl: string) {

  }
});
