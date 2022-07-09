// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { AppComponent } from './app.component'

  describe('AppComponent', () => {

  const fakeLocation = {
    href: ""
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: 'Location', useValue: fakeLocation }
      ]
    }).compileComponents()
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
    const shareUrl = "https://google.com"
    fakeLocation.href = generateShareLink(shareUrl)

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;


    spyOnProperty(navigator, 'userAgent').and.returnValue(USER_AGENT_ANDROID_CHROME_BROWSER)

    // when
    app.ngOnInit()

    // then
    const calledIntent = fakeLocation.href
    const splittedIntent = calledIntent.split(';')
    expect(splittedIntent[0]).toEqual(`intent://${new URL(shareUrl).host}#Intent`)
    expect(splittedIntent[1]).toEqual(`scheme=https`)
    expect(splittedIntent[2]).toEqual(`package=${app.PACKAGE_ID}`)
    expect(splittedIntent[3]).toEqual(`S.browser_fallback_url=${new URL(shareUrl).host}`)
    expect(splittedIntent[4]).toEqual(`action=android.intent.action.VIEW`)
    expect(splittedIntent[5]).toEqual(`end`)
  }));

  it('should move android intent including \
    target url via iframe when use not chrome browser', fakeAsync(() => {
    // given
    const shareUrl = "https://google.com"
    fakeLocation.href = generateShareLink(shareUrl)

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const navigateWithIframe = spyOn<any>(app, 'navigateWithIframe')
      .and.callFake((url: string): void => console.log("do not move for test"))

    spyOnProperty(navigator, 'userAgent')
      .and.returnValue(USER_AGENT_ANDROID_KAKAOTALK_WEB_VIEW)

    // when
    app.ngOnInit()
    tick()
    fixture.detectChanges()

    // then
    expect(navigateWithIframe).toHaveBeenCalled()

    const description = fixture.debugElement.query(By.css(".bannerDescription"))
    expect(description.nativeElement.textContent.trim()).toEqual(app.DEFAULT_BANNER_DESCRIPTION)

    // after few time, means failed to move with intent then should move to playstore
    tick(app.DEFAULT_WAIT_TIME_MS)

    const playStoreUrl = fakeLocation.href
    expect(playStoreUrl).toEqual(`${app.PLAYSTORE_URL}?id=${app.PACKAGE_ID}`)
  }));

  it('should just move to target url if not android platform', fakeAsync(() => {
    // given
    const shareUrl = "https://google.com"
    fakeLocation.href = generateShareLink(shareUrl)

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    spyOnProperty(navigator, 'userAgent')
      .and.returnValue(USER_AGENT_LINUX_CHROME)

    // when
    app.ngOnInit()
    tick()

    // then
    const moveUrl = fakeLocation.href
    expect(moveUrl.toString()).toEqual(shareUrl.toString())
  }));

  it('should move to banana dev page if invalid sharelink', fakeAsync(() => {
    // given
    // shareUrl without "shareLink" param
    const shareUrl = window.location.toString()
    fakeLocation.href = shareUrl

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // when
    app.ngOnInit()
    tick()

    // then
    expect(fakeLocation.href).toEqual(app.TRIPLE_BANANA_DEV_URL)
  }));

  function generateShareLink(url: string) {
    return `${TRIPLE_BANANA_SHARE_URL}?sharelink=${url}`
  }
})
